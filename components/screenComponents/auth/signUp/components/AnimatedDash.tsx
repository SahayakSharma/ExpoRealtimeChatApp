import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export default function AnimatedDash({className,value,activeValue}:{className?:string,value:number,activeValue:number}) {

    const widthFactor = useSharedValue(0);
    const transformXFactor = useSharedValue(0);
    const DASH_WIDTH = 40;

    function handleAnimation(){
        if(activeValue === value){
            transformXFactor.value = 0;
            widthFactor.value = 0;
            widthFactor.value = withSpring(DASH_WIDTH,{
                duration:1000
            });
        }
        else if (activeValue === value + 1){
            transformXFactor.value = withSpring(DASH_WIDTH,{
                duration:1000
            });
        }
        else if(activeValue === 1 && value === 3){
            transformXFactor.value = withSpring(DASH_WIDTH,{
                duration:1000
            });
        }
        else if(activeValue === value -1){
            transformXFactor.value = withSpring(DASH_WIDTH,{
                duration:1000
            });
        }
    }

    const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: transformXFactor.value }],
      width: widthFactor.value,
    };
  });


    useEffect(()=>{
        handleAnimation();
    },[activeValue])

    return(
        <View className={`w-[30px] h-[5px] rounded-md bg-c4 ${className} overflow-hidden`}>
            <Animated.View style={[animatedStyle,{backgroundColor:'black',height:7}]}/>
        </View>
    )
}