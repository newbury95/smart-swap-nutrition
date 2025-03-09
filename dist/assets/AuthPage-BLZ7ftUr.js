import{c as Q,u as X,a0 as Z,a as ee,x as se,r,j as e,E as ae,B as m,y as v}from"./index-C8xUIhnV.js";import{I as t}from"./input-CA8yTP9w.js";import{C as re,a as te,b as ie,d as ne,c as le}from"./card-CBl8-v76.js";import{T as ce,a as oe,b as L,c as D}from"./tabs-Brd7dBto.js";import{L as i}from"./label-fbWzXd2K.js";import{A as f,a as y}from"./alert-Q5kzU01V.js";import"./index-8zAoyaKz.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=Q("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]),je=()=>{const c=X(),R=Z(),{toast:o}=ee(),{user:g,loading:x}=se(),N=new URLSearchParams(R.search),B=N.get("tab"),p=N.get("redirect"),[h,b]=r.useState(""),[C,H]=r.useState(""),[S,U]=r.useState(""),[E,W]=r.useState(""),[P,_]=r.useState(""),[j,M]=r.useState(""),[k,Y]=r.useState(""),[F,V]=r.useState(""),[T,$]=r.useState(""),[z,q]=r.useState(!1),[d,n]=r.useState(!1),[u,l]=r.useState(""),[G,I]=r.useState(B==="signup"?"signup":"signin");r.useEffect(()=>{!x&&g&&c(p==="premium"?"/premium":"/diary")},[x,g,c,p]);const J=async s=>{s.preventDefault(),n(!0),l("");try{const{error:a}=await v.auth.signInWithPassword({email:h,password:C});if(a)throw a;o({title:"Welcome back!",description:"You have successfully signed in."}),c(p==="premium"?"/premium":"/diary")}catch(a){l(a.message),o({variant:"destructive",title:"Error",description:a.message})}finally{n(!1)}},K=async s=>{if(s.preventDefault(),n(!0),l(""),j!==k){l("Passwords do not match"),n(!1);return}try{const{data:a,error:A}=await v.auth.signUp({email:P,password:j,options:{data:{first_name:S,last_name:E,height:Number(F),weight:Number(T),is_premium:!1}}});if(A)throw A;o({title:"Account created!",description:"Check your email to verify your account."}),I("signin")}catch(a){l(a.message),o({variant:"destructive",title:"Error",description:a.message})}finally{n(!1)}},O=async s=>{s.preventDefault(),n(!0),l("");try{const{error:a}=await v.auth.resetPasswordForEmail(h,{redirectTo:`${window.location.origin}/auth/reset-password`});if(a)throw a;o({title:"Check your email",description:"Password reset instructions have been sent to your email."})}catch(a){l(a.message),o({variant:"destructive",title:"Error",description:a.message})}finally{n(!1)}};return x?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"})}):g?null:e.jsx(ae,{fallback:e.jsx("div",{className:"p-4 bg-red-100 rounded-md text-red-700 m-4",children:"There was an error loading the authentication page."}),children:e.jsx("div",{className:"min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white py-12",children:e.jsxs("div",{className:"container max-w-md mx-auto px-4",children:[e.jsx(m,{onClick:()=>c("/"),variant:"ghost",className:"mb-6",children:"Back to Home"}),e.jsxs(re,{className:"shadow-lg",children:[e.jsxs(te,{className:"space-y-1",children:[e.jsx(ie,{className:"text-2xl font-bold text-center",children:"NutriTrack"}),e.jsx(ne,{className:"text-center",children:"Your journey to a healthier lifestyle starts here"})]}),e.jsx(le,{children:z?e.jsxs("form",{onSubmit:O,className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"email",children:"Email"}),e.jsx(t,{id:"email",type:"email",required:!0,value:h,onChange:s=>b(s.target.value),placeholder:"Enter your email"})]}),u&&e.jsxs(f,{variant:"destructive",children:[e.jsx(w,{className:"h-4 w-4"}),e.jsx(y,{children:u})]}),e.jsx(m,{type:"submit",className:"w-full",disabled:d,children:d?"Sending...":"Send Reset Instructions"}),e.jsx("div",{className:"text-center",children:e.jsx(m,{variant:"link",onClick:()=>q(!1),className:"text-sm",children:"Back to Sign In"})})]}):e.jsxs(ce,{value:G,onValueChange:I,children:[e.jsxs(oe,{className:"grid w-full grid-cols-2 mb-6",children:[e.jsx(L,{value:"signin",children:"Sign In"}),e.jsx(L,{value:"signup",children:"Sign Up"})]}),e.jsx(D,{value:"signin",children:e.jsxs("form",{onSubmit:J,className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"email",children:"Email"}),e.jsx(t,{id:"email",type:"email",required:!0,value:h,onChange:s=>b(s.target.value),placeholder:"Enter your email"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(i,{htmlFor:"password",children:"Password"}),e.jsx(m,{variant:"link",className:"text-xs p-0 h-auto",onClick:()=>q(!0),children:"Forgot password?"})]}),e.jsx(t,{id:"password",type:"password",required:!0,value:C,onChange:s=>H(s.target.value),placeholder:"Enter your password"})]}),u&&e.jsxs(f,{variant:"destructive",children:[e.jsx(w,{className:"h-4 w-4"}),e.jsx(y,{children:u})]}),e.jsx(m,{type:"submit",className:"w-full",disabled:d,children:d?"Signing in...":"Sign In"})]})}),e.jsx(D,{value:"signup",children:e.jsxs("form",{onSubmit:K,className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"firstName",children:"First Name"}),e.jsx(t,{id:"firstName",required:!0,value:S,onChange:s=>U(s.target.value)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"lastName",children:"Last Name"}),e.jsx(t,{id:"lastName",required:!0,value:E,onChange:s=>W(s.target.value)})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"signupEmail",children:"Email"}),e.jsx(t,{id:"signupEmail",type:"email",required:!0,value:P,onChange:s=>_(s.target.value)})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"height",children:"Height (cm)"}),e.jsx(t,{id:"height",type:"number",required:!0,value:F,onChange:s=>V(s.target.value)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"weight",children:"Weight (kg)"}),e.jsx(t,{id:"weight",type:"number",required:!0,value:T,onChange:s=>$(s.target.value)})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"signupPassword",children:"Password"}),e.jsx(t,{id:"signupPassword",type:"password",required:!0,value:j,onChange:s=>M(s.target.value)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(i,{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx(t,{id:"confirmPassword",type:"password",required:!0,value:k,onChange:s=>Y(s.target.value)})]}),u&&e.jsxs(f,{variant:"destructive",children:[e.jsx(w,{className:"h-4 w-4"}),e.jsx(y,{children:u})]}),e.jsx(m,{type:"submit",className:"w-full",disabled:d,children:d?"Creating account...":"Create Account"})]})})]})})]})]})})})};export{je as default};
