import {combineReducers,createStore,bindActionCreators} from 'redux';
import React,{useState} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import {connect,Provider} from 'react-redux';
import {useImmer} from 'use-immer'

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

const RESET = "ACTION/RESET";

const INC = "ACTION/INC";

const DEC = "ACTION/DEC";

function counter_reducer(count, action) {
  if (count === undefined) {
    return 0;
  }
  if (action.type == INC) {
    return (count + 1) % 10;
  } else if (action.type == DEC) {
    return (count + 9) % 10;
  } else if (action.type == RESET) {
    return 0;
  } else {
    return count;
  }
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
        content="RESET"
        shrink={true}
        onPress={function () {
          props.fn.reset();
        }}
        mouse={true}
        padding={{ top: 1, right: 1, bottom: 1, left: 1 }}
        style={{ blink: true, bg: "green", focus: { bold: true } }}
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
          style={{
            blink: true,
            fg: "white",
            bg: "blue",
            focus: { bold: true },
          }}
        ></button>
      </box>
    </box>
  );
}

function main_reducer(state, action) {
  console.log("MAIN", state, action);
  return { counter: counter_reducer(state.counter, action) };
}

function action_reset() {
  return { type: RESET };
}

function action_inc() {
  return { type: INC };
}

function action_dec() {
  return { type: DEC };
}

function App() {
  const [global, updateGlobal] = useImmer({ counter: 0 });
  return (
    <box
      label="Tui Counter Immer"
      border="line"
      style={{ border: { fg: "magenta" } }}
    >
      <box left={5}>
        <box top={3}>
          <text top={-1} left={1}>
            COUNTER
          </text>
          <Counter
            global={global}
            fn={{
              inc: function () {
                updateGlobal(function (draft) {
                  draft.counter++;
                });
              },
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

function AppContainer(props) {
  return (
    <box
      label="Tui Counter Redux"
      border="line"
      style={{ border: { fg: "green" } }}
    >
      <box left={5}>
        <box top={3}>
          <text top={-1} left={1}>
            COUNTER
          </text>
          <Counter
            state={props.state}
            doDec={props.doDec}
            doInc={props.doInc}
            doReset={props.doReset}
          ></Counter>
        </box>
      </box>
    </box>
  );
}

function mapStateToProps(state) {
  return { state: state.counter };
}

function mapDispatchToProps(dispatch) {
  return {
    doInc: function () {
      dispatch(action_inc());
    },
    doDec: function () {
      dispatch(action_dec());
    },
    doReset: function () {
      dispatch(action_reset());
    },
  };
}

main()