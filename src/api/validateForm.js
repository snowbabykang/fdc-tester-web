// 检测手机号
export const validatePhone = phone => {
    const reg =  /^1[3456789][0-9]{9}$/;
    if(!reg.test(phone)){
        return "请输入正确手机号";
    }else{
        return "";
    }
}
// 检测身份证
export const validateIDcard = value => {
    const msg = "请填写正确的身份证号码";
    if(value.length==18){
        return getIdCardInfo(value) == value ? "" : msg;
    }else if(value.length==15){
        var id18=idCard15To18(value);
        return getIdCardInfo(id18) == value ? "" : msg;
    }else{
        return msg;
    }
}
export const getIdCardInfo = idcard => {
    let sigma = 0;
    const a = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );
    const w = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    for(let i = 0; i < 17; i++) {
        let ai = parseInt(idcard.substring(i, i + 1));
        let wi = a[i];
        sigma += ai * wi;
    }
    let number = sigma % 11;
    return idcard.substring(0,17)+w[number];
}
export const idCard15To18 = id => {
    const W = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    const A = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    let i,j,s=0;
    let newid;
    newid = id;
    newid = newid.substring(0,6)+"19"+newid.substring(6,id.length);
    for(i=0; i<newid.length; i++ ){
       j = parseInt(newid.substring(i,i+1))*W[i];
       s = s + j;
    } 
    s = s % 11;
    newid=newid+A[s];
    return newid;
}

// 验证密码
/*
    必须是6~24位，以字母、数字开头结尾，
    有效字符包括字母、数字、“~”、“!”、“@”、“$”、“^”、“*”、“-”、“_”、“=”、“|”，
    非顺序字符，至少包含5种不同的字符
*/
export const trim = psd => {
    return psd.replace(/\s+/g,"");
}
export const validatePsd = psd => {
    if (trim(psd) != psd) { 
        return "密码不能使用空格，请更换"; 
    } 
    if (psd.length < 6 || psd.length > 24) { 
        return "密码长度应为6-24位"; 
    } 
    var mreg = /^[a-zA-Z0-9][a-zA-Z0-9~!@$^\*\-_=\|]{4,22}[a-zA-Z0-9]$/; 
    if (!mreg.test(psd)) { 
        return "以字母数字开头结尾，可含“~!@$^*-_=|”";
    } 
    let unique_psd = psd.replace(/(.).*\1/g,"$1"); 
    if (unique_psd.length < 5) { 
        return "密码至少包含5种不同的字符"; 
    } 
    if (!checkPasswordRule(psd)) { 
        return "密码不能存在叠字以及连续性字母或数字"; 
    } 
    return "";

}

export const checkStrong = psd => {
    var regUpper = /[A-Z]/;
    var regLower = /[a-z]/;
    var regNum = /[0-9]/;
    var reg = /[~!@$^\*\-_=\|]/;
    var complex = 0;
    if(regLower.test(psd)) {
        ++complex;        
    }         
    if(regUpper.test(psd)) {            
        ++complex;         
    }         
    if(regNum.test(psd)) {      
        ++complex;        
    }
    if(reg.test(psd)){
        let unique_psd = psd.replace(/(.).*\1/g,"$1"); 
        var length = unique_psd.match(/[~!@$^\*\-_=\|]/g).length;
        complex += length;
    }
    return complex;
}

/** * 检查密码是否包含叠字字符串或者包含连续字母、连续数字字符串（如："aaa"，"abc"，"321"） */ 
export const checkPasswordRule = password => {
    //1.检查是否包含叠字字符串 
    var mreg = /^.*(.)\1{2,}.*$/; 
    if (mreg.test(password)) { return false; } 
        //2.检查是否包含连续字母、连续数字字符串 
        if (password.length >= 3) { 
            var flag = true; 
            for (var i = 0; i < password.length-2; i++) { 
            var ch1 = password.charCodeAt(i); 
            var ch2 = password.charCodeAt(i+1); 
            var ch3 = password.charCodeAt(i+2); 
            if ((ch1+1) == ch2) { 
                if ((ch2+1) == ch3) { 
                flag = false; break; 
                } 
            } else if ((ch1-1) == ch2) {
                if((ch2-1) == ch3) { 
                    flag = false; break; 
                } 
            } 
        } 
        return flag; 
    } 
    return true; 
}