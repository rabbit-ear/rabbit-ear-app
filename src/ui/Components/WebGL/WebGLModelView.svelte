<script lang="ts">
  import type { WebGLModel } from "rabbit-ear/types.js";
  import { drawModel } from "rabbit-ear/webgl/general/model.js";

  type PropsType = {
    gl?: WebGLRenderingContext | WebGL2RenderingContext;
    version?: number;
    models?: WebGLModel[];
    uniformOptions?: object;
  };

  let { gl, version, models = [], uniformOptions = {} }: PropsType = $props();

  let uniforms = $derived(models.map((model) => model.makeUniforms(uniformOptions)));

  $effect(() => {
    if (!gl) {
      return;
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    models.forEach((model, i) => drawModel(gl, version, model, uniforms[i]));
  });
</script>
