import * as React from "react";
import { ButtonWrapper, Props, State } from "./ButtonWrapper";
import { RefreshCw } from "react-feather";

function SpinnyButtonInside(props: { state: State}){
    const ref = React.createRef<HTMLDivElement>()
    const currentAnimation = React.useRef<Animation>()
    React.useEffect(() => {
        if(currentAnimation.current == undefined && ref.current != undefined){
            currentAnimation.current = ref.current.animate([
                {
                    transform: 'rotate(0)'
                },
                {
                    transform: 'rotate(360deg)'
                },
            ], {
                duration: 500,
                easing: 'ease-in-out'
            })
            if(!props.state.clicked)
                currentAnimation.current.pause()
        }
        const update = () => {
            if(props.state.clicked){
                (currentAnimation.current != undefined && currentAnimation.current.playState) != 'running' && currentAnimation.current.play()
            }else{
                //currentAnimation.current && (currentAnimation.current.playbackRate = 1.5)
            }
        }
        currentAnimation.current.onfinish = (ev) => {
            update()
        }
        update()
        return () => {
            //currentAnimation.current && (currentAnimation.current.onfinish = undefined)
        }
    }, [props.state.clicked])
    return <div ref={ref} style={{height:'18px', lineHeight: '10px'}}><RefreshCw width='18' height='18'/></div>
}

function SpinnyButton(props: Props) {
	return <ButtonWrapper {...props} color='transparent' className={(props.className || "") + ' p-0'} customRender={(state) => {
        return <SpinnyButtonInside state={state}/> 
    }}/>
}

export default SpinnyButton;
