import router from '@/router'
import store from '@/vuex/store'
import {getpower} from '@/service/getData'
function checkmenu(){
    let powerlist = store.getters.getPower;
    let routes = router.options.routes;
    let obj = {};
    for(var i = 0 ; i < routes.length; i++){
        if(routes[i].meta && routes[i].meta.group){
            let isExist = false;
            for(var j = 0;j < routes[i].children.length; j++){
                if(routes[i].children[j].meta && routes[i].children[j].meta.powerid){
                    if(powerlist[routes[i].children[j].meta.powerid] !== undefined){
                        isExist = true;
                    }
                }
            }
            obj[i] = isExist;
        }else{
            obj[i] = "";
        }
    }
    store.dispatch('saveMenuPower',obj);
}
export default {
    // 上传图片路径
    uploadUrl : process.env.UPLOAD_URL,
    checkimg : (file) => {
        return new Promise((resolve, reject) => {
            const isJPEG = file.type === 'image/jpeg';
            const isJPG = file.type === 'image/jpg';
            const isPNG = file.type === 'image/png';
            const isBMP = file.type === 'image/bmp';
            const isRAW = file.type === 'image/raw';
            const isPic = isJPG || isJPEG || isPNG || isBMP || isRAW;
            if (!isPic) {
                Vue.prototype.$message.error('支持图片格式.png.jpg.jepg.bmp.raw');
                return reject(false)
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var image = new Image();
                image.onload=function(){
                    var squareW = this.width,
                        squareH = this.height,
                        canvas = document.createElement('canvas'),
                        context = canvas.getContext('2d'),
                        imageWidth = 0, //压缩图片大小
                        imageHeight = 0,
                        offsetX = 0,
                        offsetY = 0,
                        data = '';
                        var ratio;    //等比压缩，小于两百万像素
                        if ((ratio = squareW * squareH / 2000000)>1) {
                            ratio = Math.sqrt(ratio);
                            squareW = parseInt(squareW/ratio);
                            squareH = parseInt(squareH/ratio);
                        }else {
                            ratio = 1;
                        }
                        canvas.width = squareW;
                        canvas.height = squareH;
                        // 铺底色,png图铺白色
                        context.clearRect(0,0,squareW,squareH);
                        context.fillStyle = "#fff";
                        context.fillRect(0,0,squareW,squareH);
                    
                    const isLt2M = file.size / 1024 / 1024 < 2
                    if (!isLt2M) {
                        if(this.width > squareW){
                            imageWidth = Math.round(squareW);
                            imageHeight = squareH;
                            offsetX = Math.round((imageWidth-squareW)/2);
                        }else{
                            imageHeight = Math.round(squareH);
                            imageWidth = squareW;
                            offsetY = Math.round((imageHeight - squareH)/2)
                        }
                        context.drawImage(this,offsetX,offsetY,imageWidth,imageHeight);

                        data = canvas.toDataURL('image/jpeg');
                        var initSize = file.size;
                        var arr = data.split(',');
                        var mime = arr[0].match(/:(.*?);/)[1];
                        var bstr = atob(arr[1]);
                        var n = bstr.length;
                        var u8arr = new Uint8Array(n);
                        while(n--){
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return resolve(new File([u8arr],file.name, {type:mime}));
                    }else{
                        return resolve(true);
                    }
                };
                image.src= e.target.result;
            };
            reader.readAsDataURL(file);
        });
    },
    checkpdf : (file) => {
        return new Promise((resolve, reject) => {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                Vue.prototype.$message.error('支持pdf文件');
                return reject(false)
            }
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                Vue.prototype.$message.error('文件大小必须小于2MB!');
                return reject(false)
            }
            return resolve(true);

        });
    },
    getPopupContainer (trigger) {
        return trigger.parentElement
    },
    getPower : () => {
        getpower().then((res) => {
            if(res && res.code == 200){
                let obj = {};
                for(var i in res.data.permissions){
                    for(var j in res.data.permissions[i].sonNodes){
                        obj[res.data.permissions[i].sonNodes[j].id] = res.data.permissions[i].sonNodes[j].permissionType;
                    }
                }
                store.dispatch('savePower',obj);
                store.dispatch('savePowerName',res.data.roleName);
                checkmenu();
            }
        })
    },
}
