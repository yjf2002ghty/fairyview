const lzmalib=require("lzma/src/lzma-c.js");

const BASE64_encode_replacer1=new RegExp("\\+","g");
const BASE64_encode_replacer2=new RegExp("\\/","g");

function ArrayToBase64(DataArray)
{
    if (!(DataArray instanceof Array))
    {
        throw TypeError();
    }
    let i=0;
    for (i=0;i<DataArray.length;i++)
    {
        DataArray[i]+=128;
    }
    return btoa(String.fromCharCode(...DataArray)).replace(BASE64_encode_replacer1,"-").replace(BASE64_encode_replacer2,"_");
}

export function EncodeQuery(Data)
{
    if (typeof Data!="string")
    {
        throw TypeError();
    }
    return ArrayToBase64(lzmalib.LZMA.compress(Data));
}
