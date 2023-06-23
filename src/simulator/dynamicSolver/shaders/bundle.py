# The Javascript ecosystem has trouble reading raw text files.
# Each framework/bundler has a workaround, nothing universal.

# Even during development, it's likely that the shader files will
# never be touched, and can be bundled into one file for storage.

# This script will bundle all shader files into one of two formats:
# - JSON
# - javascript file with named exports

import json 

files = [
	["vertexShader", "vertexShader.vert"],
	["positionCalcShader", "positionCalcShader.frag"],
	["velocityCalcVerletShader", "velocityCalcVerletShader.frag"],
	["velocityCalcShader", "velocityCalcShader.frag"],
	["positionCalcVerletShader", "positionCalcVerletShader.frag"],
	["thetaCalcShader", "thetaCalcShader.frag"],
	["normalCalc", "normalCalc.frag"],
	["packToBytesShader", "packToBytesShader.frag"],
	["zeroTexture", "zeroTexture.frag"],
	["zeroThetaTexture", "zeroThetaTexture.frag"],
	["centerTexture", "centerTexture.frag"],
	["copyTexture", "copyTexture.frag"],
	["updateCreaseGeo", "updateCreaseGeo.frag"],
]

# # write a JSON file
# bundle = {}
# for [name, path] in files:
# 	f = open(path)
# 	bundle[name] = f.read()
# 	f.close()
# json = json.dumps(bundle, indent = 2) 
# with open('shaders.json', 'w') as f:
# 	f.write(json)

# write a .js file with named exports
bundle = ""
for [name, path] in files:
	f = open(path)
	bundle += "export const " + name + " = `" + f.read() + "`;\n\n"
	f.close()

with open('shaders.js', 'w') as f:
	f.write(bundle)
