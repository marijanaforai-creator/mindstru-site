export const PLANS={
 free_trial:{name:"30 dana probno",price:0,limits:{projects:10,storageMb:500,aiGenerations:100,automations:5,promptPremium:false}},
 pro:{name:"Pro",price:9.90,limits:{projects:50,storageMb:5000,aiGenerations:500,automations:20,promptPremium:false}},
 premium:{name:"Premium",price:19.90,limits:{projects:200,storageMb:25000,aiGenerations:2000,automations:100,promptPremium:true}},
 business:{name:"Business",price:49.90,limits:{projects:1000,storageMb:100000,aiGenerations:10000,automations:500,promptPremium:true}}
};

export function getPlan(plan){return PLANS[plan]||PLANS.free_trial;}
export function hasFeature(plan,feature){
 const p=getPlan(plan);
 if(feature==="promptPremium")return Boolean(p.limits.promptPremium);
 return true;
}
