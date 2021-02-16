import { useImmer } from "use-immer";
import React, { useState, useEffect } from "react";
import blessed from "blessed";
import { render } from "react-blessed";
import _ from "lodash";

function Screen() {
  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: "Tui Counter Immer",
  });
  screen.key(["q", "C-c", "Esc"], function () {
    this.destroy();
  });
  return screen;
}

function Counter(props) {
  return (
    <box>
      <box
        padding={{ top: 2, right: 5, bottom: 2, left: 5 }}
        width={14}
        height={7}
        border="line"
        content={"" + props.global.counter}
      ></box>
      <button
        top={2}
        left={16}
        content="START"
        onPress={function () {
          props.fn.start();
        }}
        shrink={true}
        mouse={true}
        padding={{ top: 1, right: 1, bottom: 1, left: 1 }}
        style={{
          bg: null == props.global.timer ? "green" : "black",
          fg: null == props.global.timer ? "white" : "gray",
          focus: { bold: true },
        }}
      ></button>
      <button
        top={2}
        left={26}
        content="STOP"
        shrink={true}
        onPress={function () {
          props.fn.stop();
        }}
        mouse={true}
        padding={{ top: 1, right: 1, bottom: 1, left: 1 }}
        style={{
          bg: null != props.global.timer ? "red" : "black",
          fg: null != props.global.timer ? "white" : "gray",
          focus: { bold: true },
        }}
      ></button>
      <button
        top={2}
        left={36}
        content="RESET"
        shrink={true}
        onPress={function () {
          props.fn.reset();
        }}
        mouse={true}
        padding={{ top: 1, right: 1, bottom: 1, left: 1 }}
        style={{ bg: "yellow", fg: "black", focus: { bold: true } }}
      ></button>
      <box top={8}>
        <button
          left={1}
          content="DEC"
          onPress={function () {
            props.fn.dec();
          }}
          shrink={true}
          mouse={true}
          padding={{ top: 1, right: 1, bottom: 1, left: 1 }}
          style={{ fg: "blue", bg: "white", focus: { bold: true } }}
        ></button>
        <button
          left={8}
          content="INC"
          shrink={true}
          onPress={function () {
            props.fn.inc();
          }}
          mouse={true}
          padding={{ top: 1, right: 1, bottom: 1, left: 1 }}
          style={{ fg: "white", bg: "blue", focus: { bold: true } }}
        ></button>
      </box>
      <box top={14}></box>
    </box>
  );
}

function App() {
  const [global, updateGlobal] = useImmer({ counter: 0, timer: null });
  const incFn = function () {
    updateGlobal(function (draft) {
      draft.counter++;
    });
  };
  return (
    <box
      label="Tui Counter Immer"
      border="line"
      style={{ border: { fg: "magenta" } }}
    >
      <box left={5}>
        <box top={3}>
          <text top={-1} left={1}>
            {"COUNTER" + (null == global.timer ? " - stopped" : " - started")}
          </text>
          <Counter
            global={global}
            fn={{
              inc: incFn,
              reset: function () {
                updateGlobal(function (draft) {
                  draft.counter = 0;
                });
              },
              dec: function () {
                updateGlobal(function (draft) {
                  draft.counter--;
                });
              },
              stop: function () {
                updateGlobal(function (draft) {
                  if (!null != draft.timer) {
                    clearInterval(draft.timer);
                    draft.timer = null;
                  }
                });
              },
              start: function () {
                updateGlobal(function (draft) {
                  if (null == draft.timer) {
                    draft.timer = setInterval(incFn, 1000);
                  }
                });
              },
            }}
          ></Counter>
        </box>
      </box>
    </box>
  );
}

function main() {
  render(<App></App>, Screen());
}

main()