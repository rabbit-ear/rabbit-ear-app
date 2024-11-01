export const vertexShader = `attribute vec2 a_position;
void main() {
   gl_Position = vec4(a_position, 0, 1);
}
`;

export const positionCalcShader = `precision mediump float;
uniform vec2 u_textureDimNodes;
uniform float u_dt;
uniform sampler2D u_lastPosition;
uniform sampler2D u_velocity;
uniform sampler2D u_mass;

void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimNodes;

  vec3 lastPosition = texture2D(u_lastPosition, scaledFragCoord).xyz;

  float isFixed = texture2D(u_mass, scaledFragCoord).y;
  if (isFixed == 1.0){
    gl_FragColor = vec4(lastPosition, 0.0);
    return;
  }

  vec4 velocityData = texture2D(u_velocity, scaledFragCoord);
  vec3 position = velocityData.xyz*u_dt + lastPosition;
  gl_FragColor = vec4(position, velocityData.a);//velocity.a has error info
}
`;

export const velocityCalcVerletShader = `precision mediump float;
uniform vec2 u_textureDimNodes;
uniform float u_dt;
uniform sampler2D u_position;
uniform sampler2D u_lastPosition;
uniform sampler2D u_mass;

void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimNodes;

  float isFixed = texture2D(u_mass, scaledFragCoord).y;
  if (isFixed == 1.0){
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 position = texture2D(u_position, scaledFragCoord).xyz;
  vec3 lastPosition = texture2D(u_lastPosition, scaledFragCoord).xyz;
  gl_FragColor = vec4((position-lastPosition)/u_dt,0.0);
}
`;

export const velocityCalcShader = `precision mediump float;
uniform vec2 u_textureDimNodes;
uniform vec2 u_textureDimFaces;
uniform vec2 u_textureDimCreases;
uniform vec2 u_textureDimNodeEdges;
uniform vec2 u_textureDimNodeFaces;
uniform vec2 u_textureDimNodeCreases;
uniform float u_creasePercent;
uniform float u_dt;
uniform float u_axialStiffness;
uniform float u_faceStiffness;
uniform sampler2D u_lastPosition;
uniform sampler2D u_lastVelocity;
uniform sampler2D u_originalPosition;
uniform sampler2D u_externalForces;
uniform sampler2D u_mass;
uniform sampler2D u_meta;//[beamsIndex, numBeam, nodeCreaseMetaIndex, numCreases]
uniform sampler2D u_beamMeta;//[k, d, length, otherNodeIndex]
uniform sampler2D u_creaseMeta;//[k, d, targetTheta]
uniform sampler2D u_nodeCreaseMeta;//[creaseIndex, nodeIndex, -, -]
uniform sampler2D u_normals;
uniform sampler2D u_theta;//[theta, z, normal1Index, normal2Index]
uniform sampler2D u_creaseGeo;//[h1, h2, coef1, coef2]
uniform sampler2D u_meta2;//[nodesFaceIndex, numFaces]
uniform sampler2D u_nodeFaceMeta;//[faceIndex, a, b, c]
uniform sampler2D u_nominalTriangles;//[angleA, angleB, angleC]
uniform bool u_calcFaceStrain;

vec4 getFromArray(float index1D, vec2 dimensions, sampler2D tex){
  vec2 index = vec2(mod(index1D, dimensions.x)+0.5, floor(index1D/dimensions.x)+0.5);
  vec2 scaledIndex = index/dimensions;
  return texture2D(tex, scaledIndex);
}

vec3 getPosition(float index1D){
  vec2 index = vec2(mod(index1D, u_textureDimNodes.x)+0.5, floor(index1D/u_textureDimNodes.x)+0.5);
  vec2 scaledIndex = index/u_textureDimNodes;
  return texture2D(u_lastPosition, scaledIndex).xyz + texture2D(u_originalPosition, scaledIndex).xyz;
}

void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimNodes;

  vec2 mass = texture2D(u_mass, scaledFragCoord).xy;
  if (mass[1] == 1.0){//fixed
    gl_FragColor = vec4(0.0);
    return;
  }
  vec3 force = texture2D(u_externalForces, scaledFragCoord).xyz;
  vec3 lastPosition = texture2D(u_lastPosition, scaledFragCoord).xyz;
  vec3 lastVelocity = texture2D(u_lastVelocity, scaledFragCoord).xyz;
  vec3 originalPosition = texture2D(u_originalPosition, scaledFragCoord).xyz;

  vec4 neighborIndices = texture2D(u_meta, scaledFragCoord);
  vec4 meta = texture2D(u_meta, scaledFragCoord);
  vec2 meta2 = texture2D(u_meta2, scaledFragCoord).xy;

  float nodeError = 0.0;

  for (int j=0;j<100;j++){//for all beams (up to 100, had to put a const int in here)
    if (j >= int(meta[1])) break;

    vec4 beamMeta = getFromArray(meta[0]+float(j), u_textureDimNodeEdges, u_beamMeta);

    float neighborIndex1D = beamMeta[3];
    vec2 neighborIndex = vec2(mod(neighborIndex1D, u_textureDimNodes.x)+0.5, floor(neighborIndex1D/u_textureDimNodes.x)+0.5);
    vec2 scaledNeighborIndex = neighborIndex/u_textureDimNodes;
    vec3 neighborLastPosition = texture2D(u_lastPosition, scaledNeighborIndex).xyz;
    vec3 neighborLastVelocity = texture2D(u_lastVelocity, scaledNeighborIndex).xyz;
    vec3 neighborOriginalPosition = texture2D(u_originalPosition, scaledNeighborIndex).xyz;

    vec3 nominalDist = neighborOriginalPosition-originalPosition;
    vec3 deltaP = neighborLastPosition-lastPosition+nominalDist;
    float deltaPLength = length(deltaP);
    deltaP -= deltaP*(beamMeta[2]/deltaPLength);
    if (!u_calcFaceStrain) nodeError += abs(deltaPLength/length(nominalDist) - 1.0);
    vec3 deltaV = neighborLastVelocity-lastVelocity;

    vec3 _force = deltaP*beamMeta[0] + deltaV*beamMeta[1];
    force += _force;
  }
  if (!u_calcFaceStrain) nodeError /= meta[1];

  for (int j=0;j<100;j++){//for all creases (up to 100, had to put a const int in here)
    if (j >= int(meta[3])) break;

    vec4 nodeCreaseMeta = getFromArray(meta[2]+float(j), u_textureDimNodeCreases, u_nodeCreaseMeta);

    float creaseIndex1D = nodeCreaseMeta[0];
    vec2 creaseIndex = vec2(mod(creaseIndex1D, u_textureDimCreases.x)+0.5, floor(creaseIndex1D/u_textureDimCreases.x)+0.5);
    vec2 scaledCreaseIndex = creaseIndex/u_textureDimCreases;

    vec4 thetas = texture2D(u_theta, scaledCreaseIndex);
    vec3 creaseMeta = texture2D(u_creaseMeta, scaledCreaseIndex).xyz;//[k, d, targetTheta]
    vec4 creaseGeo = texture2D(u_creaseGeo, scaledCreaseIndex);//[h1, h2, coef1, coef2]
    if (creaseGeo[0]< 0.0) continue;//crease disabled bc it has collapsed too much

    float targetTheta = creaseMeta[2] * u_creasePercent;
    float angForce = creaseMeta[0]*(targetTheta-thetas[0]);// + creaseMeta[1]*thetas[1];

    float nodeNum = nodeCreaseMeta[1];//1, 2, 3, 4

    if (nodeNum > 2.0){//crease reaction, node is on a crease

      //node #1
      vec3 normal1 = getFromArray(thetas[2], u_textureDimFaces, u_normals).xyz;

      //node #2
      vec3 normal2 = getFromArray(thetas[3], u_textureDimFaces, u_normals).xyz;

      float coef1 = creaseGeo[2];
      float coef2 = creaseGeo[3];

      if (nodeNum == 3.0){
        coef1 = 1.0-coef1;
        coef2 = 1.0-coef2;
      }

      vec3 _force = -angForce*(coef1/creaseGeo[0]*normal1 + coef2/creaseGeo[1]*normal2);
      force += _force;

    } else {

      float normalIndex1D = thetas[2];//node #1
      float momentArm = creaseGeo[0];//node #1
      if (nodeNum == 2.0) {
        normalIndex1D = thetas[3];//node #2
        momentArm = creaseGeo[1];//node #2
      }

      vec3 normal = getFromArray(normalIndex1D, u_textureDimFaces, u_normals).xyz;

      vec3 _force = angForce/momentArm*normal;
      force += _force;
    }
  }

  for (int j=0;j<100;j++){//for all faces (up to 100, had to put a const int in here)
    if (j >= int(meta2[1])) break;

    vec4 faceMeta = getFromArray(meta2[0]+float(j), u_textureDimNodeFaces, u_nodeFaceMeta);//[face index, a, b, c]
    vec3 nominalAngles = getFromArray(faceMeta[0], u_textureDimFaces, u_nominalTriangles).xyz;//[angA, angB, angC]

    int faceIndex = 0;
    if (faceMeta[2] < 0.0) faceIndex = 1;
    if (faceMeta[3] < 0.0) faceIndex = 2;

    //get node positions
    vec3 a = faceIndex == 0 ? lastPosition+originalPosition : getPosition(faceMeta[1]);
    vec3 b = faceIndex == 1 ? lastPosition+originalPosition : getPosition(faceMeta[2]);
    vec3 c = faceIndex == 2 ? lastPosition+originalPosition : getPosition(faceMeta[3]);

    //calc angles
    vec3 ab = b-a;
    vec3 ac = c-a;
    vec3 bc = c-b;

    float lengthAB = length(ab);
    float lengthAC = length(ac);
    float lengthBC = length(bc);

    float tol = 0.0000001;
    if (abs(lengthAB) < tol || abs(lengthBC) < tol || abs(lengthAC) < tol) continue;

    ab /= lengthAB;
    ac /= lengthAC;
    bc /= lengthBC;

    vec3 angles = vec3(acos(dot(ab, ac)),
      acos(-1.0*dot(ab, bc)),
      acos(dot(ac, bc)));
    vec3 anglesDiff = nominalAngles-angles;

    vec3 normal = getFromArray(faceMeta[0], u_textureDimFaces, u_normals).xyz;

    //calc forces
    anglesDiff *= u_faceStiffness;
    if (faceIndex == 0){//a
      vec3 normalCrossAC = cross(normal, ac)/lengthAC;
      vec3 normalCrossAB = cross(normal, ab)/lengthAB;
      force -= anglesDiff[0]*(normalCrossAC - normalCrossAB);
      if (u_calcFaceStrain) nodeError += abs((nominalAngles[0]-angles[0])/nominalAngles[0]);
      force -= anglesDiff[1]*normalCrossAB;
      force += anglesDiff[2]*normalCrossAC;
    } else if (faceIndex == 1){
      vec3 normalCrossAB = cross(normal, ab)/lengthAB;
      vec3 normalCrossBC = cross(normal, bc)/lengthBC;
      force -= anglesDiff[0]*normalCrossAB;
      force += anglesDiff[1]*(normalCrossAB + normalCrossBC);
      if (u_calcFaceStrain) nodeError += abs((nominalAngles[1]-angles[1])/nominalAngles[1]);
      force -= anglesDiff[2]*normalCrossBC;
    } else if (faceIndex == 2){
      vec3 normalCrossAC = cross(normal, ac)/lengthAC;
      vec3 normalCrossBC = cross(normal, bc)/lengthBC;
      force += anglesDiff[0]*normalCrossAC;
      force -= anglesDiff[1]*normalCrossBC;
      force += anglesDiff[2]*(normalCrossBC - normalCrossAC);
      if (u_calcFaceStrain) nodeError += abs((nominalAngles[2]-angles[2])/nominalAngles[2]);
    }

  }
  if (u_calcFaceStrain) nodeError /= meta2[1];

  vec3 velocity = force*u_dt/mass[0] + lastVelocity;
  gl_FragColor = vec4(velocity,nodeError);
}
`;

export const positionCalcVerletShader = `precision mediump float;
uniform vec2 u_textureDimNodes;
uniform vec2 u_textureDimFaces;
uniform vec2 u_textureDimCreases;
uniform vec2 u_textureDimNodeEdges;
uniform vec2 u_textureDimNodeFaces;
uniform vec2 u_textureDimNodeCreases;
uniform float u_creasePercent;
uniform float u_dt;
uniform float u_axialStiffness;
uniform float u_faceStiffness;
uniform sampler2D u_lastPosition;
uniform sampler2D u_lastLastPosition;
uniform sampler2D u_lastVelocity;
uniform sampler2D u_originalPosition;
uniform sampler2D u_externalForces;
uniform sampler2D u_mass;
uniform sampler2D u_meta;//[beamsIndex, numBeam, nodeCreaseMetaIndex, numCreases]
uniform sampler2D u_beamMeta;//[k, d, length, otherNodeIndex]
uniform sampler2D u_creaseMeta;//[k, d, targetTheta]
uniform sampler2D u_nodeCreaseMeta;//[creaseIndex, nodeIndex, -, -]
uniform sampler2D u_normals;
uniform sampler2D u_theta;//[theta, z, normal1Index, normal2Index]
uniform sampler2D u_creaseGeo;//[h1, h2, coef1, coef2]
uniform sampler2D u_meta2;//[nodesFaceIndex, numFaces]
uniform sampler2D u_nodeFaceMeta;//[faceIndex, a, b, c]
uniform sampler2D u_nominalTriangles;//[angleA, angleB, angleC]

vec4 getFromArray(float index1D, vec2 dimensions, sampler2D tex){
  vec2 index = vec2(mod(index1D, dimensions.x)+0.5, floor(index1D/dimensions.x)+0.5);
  vec2 scaledIndex = index/dimensions;
  return texture2D(tex, scaledIndex);
}

vec3 getPosition(float index1D){
  vec2 index = vec2(mod(index1D, u_textureDimNodes.x)+0.5, floor(index1D/u_textureDimNodes.x)+0.5);
  vec2 scaledIndex = index/u_textureDimNodes;
  return texture2D(u_lastPosition, scaledIndex).xyz + texture2D(u_originalPosition, scaledIndex).xyz;
}

void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimNodes;

  vec3 lastPosition = texture2D(u_lastPosition, scaledFragCoord).xyz;

  vec2 mass = texture2D(u_mass, scaledFragCoord).xy;
  if (mass[1] == 1.0){//fixed
    gl_FragColor = vec4(lastPosition, 0.0);
    return;
  }
  vec3 force = texture2D(u_externalForces, scaledFragCoord).xyz;
  vec3 lastLastPosition = texture2D(u_lastLastPosition, scaledFragCoord).xyz;
  vec3 lastVelocity = texture2D(u_lastVelocity, scaledFragCoord).xyz;
  vec3 originalPosition = texture2D(u_originalPosition, scaledFragCoord).xyz;

  vec4 neighborIndices = texture2D(u_meta, scaledFragCoord);
  vec4 meta = texture2D(u_meta, scaledFragCoord);
  vec2 meta2 = texture2D(u_meta2, scaledFragCoord).xy;

  float nodeError = 0.0;

  for (int j=0;j<100;j++){//for all beams (up to 100, had to put a const int in here)
    if (j >= int(meta[1])) break;

    vec4 beamMeta = getFromArray(meta[0]+float(j), u_textureDimNodeEdges, u_beamMeta);

    float neighborIndex1D = beamMeta[3];
    vec2 neighborIndex = vec2(mod(neighborIndex1D, u_textureDimNodes.x)+0.5, floor(neighborIndex1D/u_textureDimNodes.x)+0.5);
    vec2 scaledNeighborIndex = neighborIndex/u_textureDimNodes;
    vec3 neighborLastPosition = texture2D(u_lastPosition, scaledNeighborIndex).xyz;
    vec3 neighborLastVelocity = texture2D(u_lastVelocity, scaledNeighborIndex).xyz;
    vec3 neighborOriginalPosition = texture2D(u_originalPosition, scaledNeighborIndex).xyz;

    vec3 deltaP = neighborLastPosition+neighborOriginalPosition-lastPosition-originalPosition;
    float deltaPLength = length(deltaP);
    float nominalLength = beamMeta[2];
    deltaP *= (1.0-nominalLength/deltaPLength);
    nodeError += abs(deltaPLength/nominalLength - 1.0);
    vec3 deltaV = neighborLastVelocity-lastVelocity;

    vec3 _force = deltaP*beamMeta[0] + deltaV*beamMeta[1];
    force += _force;
  }
  nodeError /= meta[1];

  for (int j=0;j<100;j++){//for all creases (up to 100, had to put a const int in here)
    if (j >= int(meta[3])) break;

    vec4 nodeCreaseMeta = getFromArray(meta[2]+float(j), u_textureDimNodeCreases, u_nodeCreaseMeta);

    float creaseIndex1D = nodeCreaseMeta[0];
    vec2 creaseIndex = vec2(mod(creaseIndex1D, u_textureDimCreases.x)+0.5, floor(creaseIndex1D/u_textureDimCreases.x)+0.5);
    vec2 scaledCreaseIndex = creaseIndex/u_textureDimCreases;

    vec4 thetas = texture2D(u_theta, scaledCreaseIndex);
    vec3 creaseMeta = texture2D(u_creaseMeta, scaledCreaseIndex).xyz;//[k, d, targetTheta]
    vec4 creaseGeo = texture2D(u_creaseGeo, scaledCreaseIndex);//[h1, h2, coef1, coef2]
    if (creaseGeo[0]< 0.0) continue;//crease disabled bc it has collapsed too much

    float targetTheta = creaseMeta[2] * u_creasePercent;
    float angForce = creaseMeta[0]*(targetTheta-thetas[0]);// + creaseMeta[1]*thetas[1];

    float nodeNum = nodeCreaseMeta[1];//1, 2, 3, 4

    if (nodeNum > 2.0){//crease reaction, node is on a crease

      //node #1
      vec3 normal1 = getFromArray(thetas[2], u_textureDimFaces, u_normals).xyz;

      //node #2
      vec3 normal2 = getFromArray(thetas[3], u_textureDimFaces, u_normals).xyz;

      float coef1 = creaseGeo[2];
      float coef2 = creaseGeo[3];

      if (nodeNum == 3.0){
        coef1 = 1.0-coef1;
        coef2 = 1.0-coef2;
      }

      vec3 _force = -angForce*(coef1/creaseGeo[0]*normal1 + coef2/creaseGeo[1]*normal2);
      force += _force;

    } else {

      float normalIndex1D = thetas[2];//node #1
      float momentArm = creaseGeo[0];//node #1
      if (nodeNum == 2.0) {
        normalIndex1D = thetas[3];//node #2
        momentArm = creaseGeo[1];//node #2
      }

      vec3 normal = getFromArray(normalIndex1D, u_textureDimFaces, u_normals).xyz;

      vec3 _force = angForce/momentArm*normal;
      force += _force;
    }
  }

  for (int j=0;j<100;j++){//for all faces (up to 100, had to put a const int in here)
    if (j >= int(meta2[1])) break;

    vec4 faceMeta = getFromArray(meta2[0]+float(j), u_textureDimNodeFaces, u_nodeFaceMeta);//[face index, a, b, c]
    vec3 nominalAngles = getFromArray(faceMeta[0], u_textureDimFaces, u_nominalTriangles).xyz;//[angA, angB, angC]

    int faceIndex = 0;
    if (faceMeta[2] < 0.0) faceIndex = 1;
    if (faceMeta[3] < 0.0) faceIndex = 2;

    //get node positions
    vec3 a = faceIndex == 0 ? lastPosition+originalPosition : getPosition(faceMeta[1]);
    vec3 b = faceIndex == 1 ? lastPosition+originalPosition : getPosition(faceMeta[2]);
    vec3 c = faceIndex == 2 ? lastPosition+originalPosition : getPosition(faceMeta[3]);

    //calc angles
    vec3 ab = b-a;
    vec3 ac = c-a;
    vec3 bc = c-b;

    float lengthAB = length(ab);
    float lengthAC = length(ac);
    float lengthBC = length(bc);

    float tol = 0.0000001;
    if (abs(lengthAB) < tol || abs(lengthBC) < tol || abs(lengthAC) < tol) continue;

    ab /= lengthAB;
    ac /= lengthAC;
    bc /= lengthBC;

    vec3 angles = vec3(acos(dot(ab, ac)),
      acos(-1.0*dot(ab, bc)),
      acos(dot(ac, bc)));
    vec3 anglesDiff = nominalAngles-angles;

    vec3 normal = getFromArray(faceMeta[0], u_textureDimFaces, u_normals).xyz;

    //calc forces
    anglesDiff *= u_faceStiffness;
    if (faceIndex == 0){//a
      vec3 normalCrossAC = cross(normal, ac)/lengthAC;
      vec3 normalCrossAB = cross(normal, ab)/lengthAB;
      force -= anglesDiff[0]*(normalCrossAC - normalCrossAB);
      force -= anglesDiff[1]*normalCrossAB;
      force += anglesDiff[2]*normalCrossAC;
    } else if (faceIndex == 1){
      vec3 normalCrossAB = cross(normal, ab)/lengthAB;
      vec3 normalCrossBC = cross(normal, bc)/lengthBC;
      force -= anglesDiff[0]*normalCrossAB;
      force += anglesDiff[1]*(normalCrossAB + normalCrossBC);
      force -= anglesDiff[2]*normalCrossBC;
    } else if (faceIndex == 2){
      vec3 normalCrossAC = cross(normal, ac)/lengthAC;
      vec3 normalCrossBC = cross(normal, bc)/lengthBC;
      force += anglesDiff[0]*normalCrossAC;
      force -= anglesDiff[1]*normalCrossBC;
      force += anglesDiff[2]*(normalCrossBC - normalCrossAC);
    }

  }

  vec3 nextPosition = force*u_dt*u_dt/mass[0] + 2.0*lastPosition - lastLastPosition;
  gl_FragColor = vec4(nextPosition,nodeError);//position.a has error info
}
`;

export const thetaCalcShader = `#define TWO_PI 6.283185307179586476925286766559
precision mediump float;
uniform vec2 u_textureDimNodes;
uniform vec2 u_textureDimFaces;
uniform vec2 u_textureDimCreases;
uniform sampler2D u_normals;
uniform sampler2D u_lastTheta;
uniform sampler2D u_creaseVectors;
uniform sampler2D u_lastPosition;
uniform sampler2D u_originalPosition;
uniform float u_dt;

vec4 getFromArray(float index1D, vec2 dimensions, sampler2D tex){
  vec2 index = vec2(mod(index1D, dimensions.x)+0.5, floor(index1D/dimensions.x)+0.5);
  vec2 scaledIndex = index/dimensions;
  return texture2D(tex, scaledIndex);
}

void main(){

  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimCreases;

  vec4 lastTheta = texture2D(u_lastTheta, scaledFragCoord);

  if (lastTheta[2]<0.0){
    gl_FragColor = vec4(lastTheta[0], 0.0, -1.0, -1.0);
    return;
  }

  vec3 normal1 = getFromArray(lastTheta[2], u_textureDimFaces, u_normals).xyz;
  vec3 normal2 = getFromArray(lastTheta[3], u_textureDimFaces, u_normals).xyz;

  float dotNormals = dot(normal1, normal2);//normals are already normalized, no need to divide by length
  if (dotNormals < -1.0) dotNormals = -1.0;
  else if (dotNormals > 1.0) dotNormals = 1.0;

  vec2 creaseVectorIndices = texture2D(u_creaseVectors, scaledFragCoord).xy;
  vec2 creaseNodeIndex = vec2(mod(creaseVectorIndices[0], u_textureDimNodes.x)+0.5, floor(creaseVectorIndices[0]/u_textureDimNodes.x)+0.5);
  vec2 scaledNodeIndex = creaseNodeIndex/u_textureDimNodes;
  vec3 node0 = texture2D(u_lastPosition, scaledNodeIndex).xyz + texture2D(u_originalPosition, scaledNodeIndex).xyz;
  creaseNodeIndex = vec2(mod(creaseVectorIndices[1], u_textureDimNodes.x)+0.5, floor(creaseVectorIndices[1]/u_textureDimNodes.x)+0.5);
  scaledNodeIndex = creaseNodeIndex/u_textureDimNodes;
  vec3 node1 = texture2D(u_lastPosition, scaledNodeIndex).xyz + texture2D(u_originalPosition, scaledNodeIndex).xyz;

  //https://math.stackexchange.com/questions/47059/how-do-i-calculate-a-dihedral-angle-given-cartesian-coordinates
  vec3 creaseVector = normalize(node1-node0);
  float x = dotNormals;
  float y = dot(cross(normal1, creaseVector), normal2);

  float theta = atan(y, x);

  float diff = theta-lastTheta[0];
  float origDiff = diff;
  if (diff < -5.0) {
    diff += TWO_PI;
  } else if (diff > 5.0) {
    diff -= TWO_PI;
  }
  theta = lastTheta[0] + diff;
  gl_FragColor = vec4(theta, diff, lastTheta[2], lastTheta[3]);//[theta, w, normal1Index, normal2Index]
}
`;

export const normalCalc = `precision mediump float;
uniform vec2 u_textureDimNodes;
uniform vec2 u_textureDimFaces;
uniform sampler2D u_faceVertexIndices;
uniform sampler2D u_lastPosition;
uniform sampler2D u_originalPosition;

vec3 getPosition(float index1D){
  vec2 index = vec2(mod(index1D, u_textureDimNodes.x)+0.5, floor(index1D/u_textureDimNodes.x)+0.5);
  vec2 scaledIndex = index/u_textureDimNodes;
  return texture2D(u_lastPosition, scaledIndex).xyz + texture2D(u_originalPosition, scaledIndex).xyz;
}

void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimFaces;

  vec3 indices = texture2D(u_faceVertexIndices, scaledFragCoord).xyz;

  vec3 a = getPosition(indices[0]);
  vec3 b = getPosition(indices[1]);
  vec3 c = getPosition(indices[2]);

  vec3 normal = normalize(cross(b-a, c-a));

  gl_FragColor = vec4(normal, 0.0);
}
`;

export const packToBytesShader = `precision mediump float;
uniform vec2 u_floatTextureDim;
uniform sampler2D u_floatTexture;
uniform float u_vectorLength;
float shift_right (float v, float amt) {
  v = floor(v) + 0.5;
  return floor(v / exp2(amt));
}
float shift_left (float v, float amt) {
  return floor(v * exp2(amt) + 0.5);
}
float mask_last (float v, float bits) {
  return mod(v, shift_left(1.0, bits));
}
float extract_bits (float num, float from, float to) {
  from = floor(from + 0.5); to = floor(to + 0.5);
  return mask_last(shift_right(num, from), to - from);
}
vec4 encode_float (float val) {
  if (val == 0.0) return vec4(0, 0, 0, 0);
  float sign = val > 0.0 ? 0.0 : 1.0;
  val = abs(val);
  float exponent = floor(log2(val));
  float biased_exponent = exponent + 127.0;
  float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0;
  float t = biased_exponent / 2.0;
  float last_bit_of_biased_exponent = fract(t) * 2.0;
  float remaining_bits_of_biased_exponent = floor(t);
  float byte4 = extract_bits(fraction, 0.0, 8.0) / 255.0;
  float byte3 = extract_bits(fraction, 8.0, 16.0) / 255.0;
  float byte2 = (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0;
  float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;
  return vec4(byte4, byte3, byte2, byte1);
}
void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  float textureXcoord = floor((fragCoord.x - 0.5)/u_vectorLength+0.0001) + 0.5;
  vec4 data = texture2D(u_floatTexture, vec2(textureXcoord, fragCoord.y)/u_floatTextureDim);
  int textureIndex = int(floor(mod(fragCoord.x-0.5+0.0001, u_vectorLength)));
  if (textureIndex == 0) gl_FragColor = encode_float(data[0]);
  else if (textureIndex == 1) gl_FragColor = encode_float(data[1]);
  else if (textureIndex == 2) gl_FragColor = encode_float(data[2]);
  else if (textureIndex == 3) gl_FragColor = encode_float(data[3]);
}
`;

export const zeroTexture = `precision mediump float;
void main(){
  gl_FragColor = vec4(0.0);
}
`;

export const zeroThetaTexture = `precision mediump float;
uniform sampler2D u_theta;
uniform vec2 u_textureDimCreases;
void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimCreases;
  vec4 theta = texture2D(u_theta, scaledFragCoord);
  gl_FragColor = vec4(0.0, 0.0, theta[2], theta[3]);
}
`;

export const centerTexture = `precision mediump float;
uniform sampler2D u_lastPosition;
uniform vec2 u_textureDimNodes;
uniform vec3 u_center;
void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimNodes;
  vec3 position = texture2D(u_lastPosition, scaledFragCoord).xyz;
  gl_FragColor = vec4(position-u_center, 0.0);
}
`;

export const copyTexture = `precision mediump float;
uniform sampler2D u_orig;
uniform vec2 u_textureDimNodes;
void main(){
  gl_FragColor = texture2D(u_orig, gl_FragCoord.xy/u_textureDimNodes);
}
`;

export const updateCreaseGeo = `precision mediump float;
uniform vec2 u_textureDimNodes;
uniform vec2 u_textureDimCreases;
uniform sampler2D u_lastPosition;
uniform sampler2D u_originalPosition;
uniform sampler2D u_creaseMeta2;

vec3 getPosition(float index1D){
  vec2 index = vec2(mod(index1D, u_textureDimNodes.x)+0.5, floor(index1D/u_textureDimNodes.x)+0.5);
  vec2 scaledIndex = index/u_textureDimNodes;
  return texture2D(u_lastPosition, scaledIndex).xyz + texture2D(u_originalPosition, scaledIndex).xyz;
}

void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 scaledFragCoord = fragCoord/u_textureDimCreases;

  vec4 creaseMeta = texture2D(u_creaseMeta2, scaledFragCoord);

  vec3 node1 = getPosition(creaseMeta[0]);
  vec3 node2 = getPosition(creaseMeta[1]);
  vec3 node3 = getPosition(creaseMeta[2]);
  vec3 node4 = getPosition(creaseMeta[3]);

  float tol = 0.000001;

  vec3 creaseVector = node4-node3;
  float creaseLength = length(creaseVector);

  if (abs(creaseLength)<tol) {
    gl_FragColor = vec4(-1);//disable crease
    return;
  }
  creaseVector /= creaseLength;

  vec3 vector1 = node1-node3;
  vec3 vector2 = node2-node3;

  float proj1Length = dot(creaseVector, vector1);
  float proj2Length = dot(creaseVector, vector2);

  float dist1 = sqrt(abs(vector1.x*vector1.x+vector1.y*vector1.y+vector1.z*vector1.z-proj1Length*proj1Length));
  float dist2 = sqrt(abs(vector2.x*vector2.x+vector2.y*vector2.y+vector2.z*vector2.z-proj2Length*proj2Length));

  if (dist1<tol || dist2<tol){
    gl_FragColor = vec4(-1);//disable crease
    return;
  }

  gl_FragColor = vec4(dist1, dist2, proj1Length/creaseLength, proj2Length/creaseLength);
}`;

