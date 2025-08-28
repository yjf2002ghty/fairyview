var lzmalib=require("lzma/src/lzma-d.js");

var BASE64_decode_replacer1=new RegExp("-","g");
var BASE64_decode_replacer2=new RegExp("_","g");

var Base64ToArray=function(Base64String)
{
    if (typeof Base64String!="string")
    {
        throw TypeError();
    }
    let decoded=atob(Base64String.replace(BASE64_decode_replacer1,"+").replace(BASE64_decode_replacer2,"/"));
    let result=[];
    let i=0;
    for (i=0;i<decoded.length;i++)
    {
        result.push(decoded.charCodeAt(i)-128);
    }
    return result;
}

export var DecodeQuery=function(Query)
{
    if (typeof Query!="string")
    {
        throw TypeError();
    }
    if (Query=="")
    {
        return "";
    }
    return lzmalib.LZMA.decompress(Base64ToArray(Query));
}

export var Free=function()
{
    Base64ToArray=null;
    DecodeQuery=null;
    lzmalib=null;
    BASE64_decode_replacer1=null;
    BASE64_decode_replacer2=null;
    Free=null;
}
