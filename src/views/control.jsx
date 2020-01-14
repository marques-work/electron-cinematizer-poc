import React from "react";
import ReactDOM from "react-dom";
import OnReadyScheduler from "views/utils/scheduler";
import Button from "views/components/button";

const scheduler = new OnReadyScheduler();

scheduler.schedule(() => {
  ReactDOM.render(
    <div>
      <p>Click something:</p>
      <Button msg="basic">Basic Example</Button>
      <Button msg="point-cube">Interactive Point Cube</Button>
    </div>,
    document.getElementById("root"),
  );
});
