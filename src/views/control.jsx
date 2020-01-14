import React from "react";
import ReactDOM from "react-dom";
import OnReadyScheduler from "views/utils/scheduler";
import Button from "views/components/button";

import "./control.scss";

const scheduler = new OnReadyScheduler();

scheduler.schedule(() => {
  ReactDOM.render(
    <div>
      <p>Click these to affect the cinema window:</p>

      <ul>
        <li><Button msg="basic">Basic Example</Button></li>
        <li><Button msg="buffer-geo">Buffer Geometry Instancing</Button></li>
        <li><Button msg="stupid-trooper">Skinning: Stupid Trooper</Button></li>
        <li><Button msg="buffer-geo-2">Buffer Geometry Cube</Button></li>
        <li><Button msg="point-lights">Point Lights</Button></li>
        <li><Button msg="point-cube">Interactive Point Cube</Button></li>
        <li><Button msg="skeletal">Skeletal Animation</Button></li>
      </ul>
    </div>,
    document.getElementById("root"),
  );
});
