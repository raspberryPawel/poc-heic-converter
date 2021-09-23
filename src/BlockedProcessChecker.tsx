import React from "react";

export class BlockedProcessChecker extends React.Component {
    protected interval: any = null;

    public state = {
        counter: 0,
    }

    public componentWillUnmount() {
        this.clearCountingInterval();
    }

    protected runCountingInterval = () => {
        this.interval = setInterval(() => {
            this.countUp();
        }, 100)
    }

    protected countUp = () => {
        const currentState = this.state.counter;
        this.setState({counter: currentState + 1});
    }

    protected clearCountingInterval = () => {
        if (this.interval) clearInterval(this.interval)
    }

    render() {
        return (
            <div className={"BlockedProcessChecker"}>
                <div>Check if main thread are blocked:</div>
                <div>{this.state.counter}</div>

                <button onClick={this.countUp}>Count up</button>
                <button onClick={this.runCountingInterval}>Run automatic counting</button>
                <button onClick={this.clearCountingInterval}>Stop counting</button>
            </div>
        )
            ;
    }
}