import React,{Component} from 'react'



class VolumeContainer extends Component{
    constructor() {
        super();
        this.state = {
            muted: false
        }
        this.renderBars = this.renderBars.bind(this)
    }
    renderBars(quantity){
        let barArray = new Array(quantity);
        barArray.fill(0);
        return barArray;

    }

    render(){
            const {quantity} = this.props;
          const bars = this.renderBars(quantity)
            return(
                <div>
                    <code>{JSON.stringify(quantity)}</code>
                    {bars.map((b, index) => <div key={index}>{index}</div>)}
                </div>
            )
        }
    }
export default VolumeContainer;
