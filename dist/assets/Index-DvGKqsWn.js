const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FreePlanCard-Bzy3Ox_0.js","assets/index-C8xUIhnV.js","assets/index-CQrm__Ca.css","assets/PlanFeatureList-Ae1GUfJI.js","assets/proxy-Dun-j3uU.js","assets/arrow-right-PFF6y-Tr.js","assets/PremiumPlanCard-Bih8W8ST.js"])))=>i.map(i=>d[i]);
import{r as s,_ as o,u as l,j as a}from"./index-C8xUIhnV.js";import{m as e}from"./proxy-Dun-j3uU.js";const c=s.lazy(()=>o(()=>import("./FreePlanCard-Bzy3Ox_0.js"),__vite__mapDeps([0,1,2,3,4,5]))),m=s.lazy(()=>o(()=>import("./PremiumPlanCard-Bih8W8ST.js"),__vite__mapDeps([6,1,2,3,4]))),n=()=>a.jsxs("div",{className:"rounded-lg border bg-card text-card-foreground shadow-sm p-6 h-[450px] animate-pulse",children:[a.jsx("div",{className:"h-7 w-3/4 bg-gray-200 rounded mb-4"}),a.jsx("div",{className:"h-4 w-1/2 bg-gray-200 rounded mb-6"}),a.jsx("div",{className:"space-y-2",children:[1,2,3,4,5].map(t=>a.jsx("div",{className:"h-4 w-full bg-gray-200 rounded"},t))})]}),h=()=>{l();const t=["Personalized meal plans","Advanced workout tracking","Premium recipes library","Expert nutrition consultation","Progress analytics"],d=["Basic meal tracking","Daily food diary","Basic health metrics","Community forum access","Email support"],r={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},i={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.5,ease:[.25,.1,.25,1]}}};return a.jsx("div",{className:"min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white",children:a.jsxs("section",{className:"container mx-auto px-4 py-12",children:[a.jsxs(e.div,{className:"text-center max-w-3xl mx-auto",initial:"hidden",animate:"visible",variants:r,children:[a.jsx(e.h1,{className:"text-4xl md:text-5xl font-bold mb-6 text-green-800",variants:i,children:"Track Your Nutrition Journey"}),a.jsx(e.p,{className:"text-lg text-gray-600 mb-8",variants:i,children:"Join our community of health enthusiasts and achieve your fitness goals with personalized nutrition tracking."})]}),a.jsxs(e.div,{initial:"hidden",animate:"visible",variants:r,className:"grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16",children:[a.jsx(e.div,{variants:i,children:a.jsx(s.Suspense,{fallback:a.jsx(n,{}),children:a.jsx(c,{features:d})})}),a.jsx(e.div,{variants:i,children:a.jsx(s.Suspense,{fallback:a.jsx(n,{}),children:a.jsx(m,{features:t})})})]})]})})};export{h as default};
