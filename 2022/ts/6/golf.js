import{readFileSync as r}from"fs";let i=[...r("i","utf8")],v=i.reduce((a,v,i)=>"number"!=typeof a&&(a.push(v),4<a.length&&a.shift(),4==new Set(a).size)?i+1:a,[]),s=i.reduce((a,v,i)=>"number"!=typeof a&&(a.push(v),14<a.length&&a.shift(),14==new Set(a).size)?i+1:a,[]);console.log(v,s);