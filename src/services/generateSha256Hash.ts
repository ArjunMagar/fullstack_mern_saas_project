import crypto from "crypto";

const generateSha256Hash = (data:string,secretKey:string)=>{
    if(!data || !secretKey){
        throw new Error("Please provide data, secretKey")
    }

    const hash = crypto.createHmac("sha256",secretKey)  // first is algo, next is secret to use with algo to generate hash
    .update(data)
    .digest("base64")

    return hash

}

export default generateSha256Hash









// note :- thing to be remained

// Generate HMAC (SHA-256)
            // const hmac = crypto.createHmac("sha256", esewaSecretKey)
            //     .update(message)
            //     .digest("base64"); // you can also use "hex"

            // console.log("HMAC (Base64):", hmac);