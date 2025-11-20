import { useEffect, useState } from "react";
import FirstSignUpStep from "./setps/FirstSignUpStep";
import SecondSignUpStep from "./setps/SecondSignUpStep";
import ThirdSignUpStep from "./setps/ThirdSignUpStep";


export default function SignUpStepManager({activeStep,nextStep,prevStep}:{activeStep:number,nextStep:()=>void,prevStep:()=>void}) {
    const [listOfActiveSteps,setListOfActiveSteps]=useState<number[]>([1]);

    useEffect(()=>{
        listOfActiveSteps.push(activeStep);
    },[activeStep])

    switch(activeStep){
        case 1:
            return <FirstSignUpStep nextStep={nextStep}/>
        case 2:
            return <SecondSignUpStep lastActiveStep={listOfActiveSteps[listOfActiveSteps.length - 1]} nextStep={nextStep} previousStep={prevStep}/>
        default:
            return <ThirdSignUpStep lastActiveStep={listOfActiveSteps[listOfActiveSteps.length - 1]} previousStep={prevStep}/>
    }
}