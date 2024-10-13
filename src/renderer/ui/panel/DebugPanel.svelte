<script lang="ts">
  import app from "../../app/App.svelte.ts";
  import { SVGViewport } from "../viewport/SVGViewport/SVGViewport.svelte.ts";
  import { WebGLViewport } from "../viewport/WebGLViewport/WebGLViewport.svelte.ts";

  const newSVG = (): void => {
    app.ui?.viewports.push(new SVGViewport());
  };
  const newWebGL = (): void => {
    app.ui?.viewports.push(new WebGLViewport());
  };
  const removeView = (): void => {
    app.ui?.viewports.pop();
  };
</script>

<div class="column gap">
  <div class="row gap">
    <button onclick={newSVG}>+ SVG</button>
    <button onclick={newWebGL}>+ GL</button>
    <button onclick={removeView}>- view</button>
  </div>

  <div class="row gap">
    <input
      type="checkbox"
      id="verticalUp"
      bind:checked={SVGViewport.settings.rightHanded} />
    <label for="verticalUp">y-axis up</label>
  </div>
</div>

<style>
  button {
    width: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .gap {
    gap: 3px;
  }
</style>
