"use strict";(()=>{var e={};e.id=290,e.ids=[290],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3885:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>m,requestAsyncStorage:()=>l,routeModule:()=>u,serverHooks:()=>g,staticGenerationAsyncStorage:()=>d});var n={};r.r(n),r.d(n,{POST:()=>p});var a=r(9303),s=r(8716),o=r(670),i=r(7070),c=r(2057);async function p(e){try{let{prompt:t,model:r}=await e.json(),n=await c.y.generateWebsite(t,r);return i.NextResponse.json(n)}catch(e){return console.error("Generate API Error:",e),i.NextResponse.json({error:"Internal Server Error"},{status:500})}}let u=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:"app/api/generate/route"},resolvedPagePath:"C:\\Users\\tanmo\\Downloads\\website-builder\\app\\api\\generate\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:g}=u,h="/api/generate/route";function m(){return(0,o.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:d})}},2057:(e,t,r)=>{r.d(t,{y:()=>o});var n=r(1258);class a{constructor(){this.genAI=new n.$D(process.env.GEMINI_API_KEY||"")}async chat(e,t){let r=this.genAI.getGenerativeModel({model:"gemini-1.5-flash"}).startChat({history:e.slice(0,-1).map(e=>({role:"user"===e.role?"user":"model",parts:[{text:e.content}]}))});return(await r.sendMessage(e[e.length-1].content)).response.text()}async generateWebsite(e,t){let r=this.genAI.getGenerativeModel({model:"gemini-1.5-flash",generationConfig:{responseMimeType:"application/json"}}),n=`You are a senior-level AI Software Architect. 
    Generate a full production-ready website based on the user prompt.
    Return a JSON object with a 'files' array, where each item has 'path' and 'content'.
    Include:
    - Frontend (React/Next.js)
    - Tailwind CSS styles
    - Basic API routes
    - README.md
    
    Structure the JSON like this:
    {
      "files": [
        { "path": "app/page.tsx", "content": "..." },
        { "path": "package.json", "content": "..." }
      ]
    }`,a=(await r.generateContent([{text:n},{text:`User Prompt: ${e}`}])).response.text();try{return JSON.parse(a)}catch(e){return console.error("Failed to parse AI response as JSON:",a),{files:[{path:"error.txt",content:"Failed to generate website structure."}]}}}}class s{async chat(e,t){return t.includes("gemini"),this.gemini.chat(e,t)}async generateWebsite(e,t){return t.includes("gemini"),this.gemini.generateWebsite(e,t)}constructor(){this.gemini=new a}}let o=new s}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[948,972,258],()=>r(3885));module.exports=n})();