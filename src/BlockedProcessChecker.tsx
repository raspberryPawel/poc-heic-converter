import React from "react";

export class BlockedProcessChecker extends React.Component {
    state = {
        counter: 0,
    }

    render() {
        return (
            <div className={"BlockedProcessChecker"}>
                <div>Check if main thread are blocked:</div>
                <div>{this.state.counter}</div>
                <button onClick={() => {
                    const currentState = this.state.counter;
                    this.setState({counter: currentState + 1});
                }}>Count up
                </button>
            </div>
        )
            ;
    }
}