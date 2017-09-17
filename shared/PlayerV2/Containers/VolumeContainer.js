import React,{Component} from 'react'
import classNames from 'classnames'

class VolumeContainer extends Component{
    constructor() {
        super();
        this.state = {
            muted: false,
            current:undefined
        }
        this.renderBars = this.renderBars.bind(this);
        this.setCurrent = this.setCurrent.bind(this);
        this.activeUnderCurrent = this.activeUnderCurrent.bind(this)
    }
    renderBars(quantity){
        let barArray = new Array(quantity);
        barArray.fill(0);
        return barArray;

    }
    setCurrent(index){
        this.setState({current: index})
    }
    activeUnderCurrent(currentIndex,index){
        if(index <= currentIndex ){
            return true
        }
    }

    render(){
            const {quantity} = this.props;
            const {current} = this.state;
          const bars = this.renderBars(quantity)
            return(
                <div>
                    {bars.map((b, index) => <div
                        key={index}
                        onClick={() => this.setCurrent(index)}
                        className={classNames('volume-bar', {'active': this.activeUnderCurrent(current, index)})}>
                        {index}</div>)}
                </div>
            )
        }
    }
export default VolumeContainer;
