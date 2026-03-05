//server action 

"use server"
import { auth } from "@clerk/nextjs/server";

//define credit transaction

const PLAN_CREDITSc={
    free_user:0,
    standard:10,
    pro:24
};

//each apportiment cost 2 credits
const APPOINTMENT_COST=2;

export async function checkAndAllocateCredits(userId){
    try {
        //check user is logged in and is patient 
        if(!userId){
            return {sucess:false,message:"User not logged"}
        }
        //patient or not 

        if(userId.role !== "PATIENT"){
            return {sucess:false,message:"Only patients can purchase credits"}
        }

        //what plan user has


        const {has}=await auth();
        const hasBasic=has({plan:"basic"});
        const hasStandard=has({plan:"standard"});
        const hasPro=has({plan:"pro"});

        //cuurent plan 

        let currentPlan=null;
        let creditsToAllocate=0;

        if(hasPro){
            currentPlan="pro";
            creditsToAllocate=PLAN_CREDITSc.pro;
        }

    } catch (error) {
        
    }

}

