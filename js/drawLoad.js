// var map = new AMap.Map('container');
var map = new AMap.Map('container', {
    zoom: 13,//级别
    center: [113.89858380216376, 23.41755521891579]
});
map.plugin("AMap.Driving");
map.plugin("AMap.DragRoute");
map.plugin("AMap.DistrictSearch");
// map.plugin("AMap.Polyline");


map.on('click', function(ev) {
  var target = ev.target;
  var lnglat = ev.lnglat;
  var pixel = ev.pixel;
  var type = ev.type;
  console.log("地理坐标", lnglat);

  var position = new AMap.LngLat(lnglat.getLng(), lnglat.getLat());
  var marker = new AMap.Marker({position : position});
  map.add(marker);
});

function aa() {
  let top = (map.getBounds( )).northeast.lat;
  let bottom = (map.getBounds( )).southwest.lat;
  let right= (map.getBounds( )).northeast.lng;
  let left= (map.getBounds( )).southwest.lng;

  let latMultiple = (top - bottom)/0.0439453125;
  let lngMultiple = (right - left)/0.0439453125;

    console.log()
  console.log(`当前地图级别为${map.getZoom()}经度差相当于${lngMultiple}个块，纬度差相当于${latMultiple}个块，`)
}


var drivingOption = {
    policy: AMap.DrivingPolicy.LEAST_TIME,
    ferry: 1
}
var polylineArr = [];
function creatRoute(routeArr) {
    for (let i = 0; i < polylineArr.length; i++) {
        polylineArr[i].hide();
    }
    polylineArr = [];
  for (let i = 0; i < routeArr.length; i++) {
    // let driving = new AMap.Driving(drivingOption);
    // driving.search(routeArr[i].start, routeArr[i].end, function(status, result) {
    //     if (status === 'complete') {
    //         if (result.routes && result.routes.length) {
    //             polylineArr.push(drawRoute(result.routes[0], routeArr[i].count));
    //             // polylineArr.push(drawRoute(result.routes[0]));
    //         }
    //     } else {
    //             alert("道路规划失败！");
    //     }
    // })
    let strokeColor = `rgb(${routeArr[i].count*20}, ${routeArr[i].count*2}, ${routeArr[i].count*2})`;
    console.log(strokeColor);   
        let lineArr = [
            routeArr[i].start,
            routeArr[i].end
        ];
        let polyline = new AMap.Polyline({
            path: lineArr,            // 设置线覆盖物路径
            strokeColor: strokeColor,   // 线颜色
            strokeOpacity: 1,         // 线透明度
            strokeWeight: 5,          // 线宽
            strokeStyle: 'solid',     // 线样式
            strokeDasharray: [10, 5], // 补充线样式
            geodesic: true            // 绘制大地线
        });
        polyline.setMap(map);
  

  }
        
    setTimeout(function() {
        // drawMarker(routeArr[0].start, routeArr[routeArr.length-1].end);
        map.setFitView();
    }, 500)
    
}
// function drawRoute (route, count) {
function drawRoute (route, count) {
    var path = parseRouteToPath(route);
    if (count == 0) {
      var strokeColor = "red";
    } else if (count == 1) {
      var strokeColor = "orange";
    } else if (count == 2) {
      var strokeColor = "green";
    }
    var routeLine = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#000',
        borderWeight: 1,
        strokeWeight: 10,
        strokeColor: strokeColor,
        lineJoin: 'round',
        cursor: 'pointer'
    })
    routeLine.setMap(map);
    return routeLine;
}
function drawMarker(start, end) {
    var startMarker = new AMap.Marker({
        position: start,
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        map: map
    })
    var endMarker = new AMap.Marker({
        position: end,
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        map: map
    })
    map.add(startMarker);
    map.add(endMarker);
}
function parseRouteToPath(route) {
    var path = []
    for (var i = 0, l = route.steps.length; i < l; i++) {
        var step = route.steps[i]
        for (var j = 0, n = step.path.length; j < n; j++) {
          path.push(step.path[j])
        }
    }
    return path
}
var polygons = [];
function getData(data,i) {
    var bounds = data.boundaries;
    let fillColor = `rgb(${i*20}, ${i*2}, ${i*2})`;
    if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
            var polygon = new AMap.Polygon({
                map: map,
                strokeWeight: 1,
                // strokeColor: '#0091ea',
                // fillColor: '#80d8ff',
                strokeColor: '#fff',
                fillColor: fillColor,
                fillOpacity: 0.5,
                path: bounds[i]
            });
            polygons.push(polygon);
        }
        map.setFitView();//地图自适应
    }
}
var opts = {
  extensions: 'all', // 返回行政区边界坐标等具体信息
};
 var districtArr = ['广州市','从化区','南沙区','花都区','白云区','海珠区','番禺区','荔湾区','增城区','黄埔区','越秀区','天河区'];
 // var districtArr = []
// var districtArr = ['台北'];
for (let i = 0; i < districtArr.length; i++ ) {
  var district = new AMap.DistrictSearch(opts);
  district.search(districtArr[i], function(status, result) {
    if(status=='complete'){
      getData(result.districtList[0], i);
      console.log(result.districtList[0].name, result.districtList[0].center);
      // var position = [result.districtList[0].center.lng, result.districtList[0].center.lat];
      // var marker = new AMap.Marker({position : position});
      // map.add(marker);
    }
  });
  setTimeout(function() {
    map.setFitView();
  }, 800);
}


var position = [113.45954429542138, 23.288599488362266];
var marker = new AMap.Marker({position : position});
map.add(marker);


function fakeClick(obj) {
   var ev = document.createEvent("MouseEvents");
   ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
   obj.dispatchEvent(ev);
}

function exportRaw(name, data) {
  var urlObject = window.URL || window.webkitURL || window;
  var export_blob = new Blob([data]);
  var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
  save_link.href = urlObject.createObjectURL(export_blob);
  save_link.download = name;
  fakeClick(save_link);
} 


// var arrPoint = [[113.242879, 23.159613],[113.242671, 23.157985],[113.242376, 23.156957],[113.242344, 23.156832],[113.242315, 23.156701],[113.242104, 23.156122],[113.242098, 23.156105],[113.242098, 23.15607],[113.242124, 23.156033],[113.242199, 23.155961],[113.242818, 23.154563],[113.243686, 23.153612],[113.244562, 23.152053],[113.244684, 23.151686],[113.244985, 23.149587],[113.244987, 23.149571],[113.244987, 23.149452],[113.244998, 23.149394],[113.245282, 23.149046],[113.245343, 23.148396],[113.247191, 23.147681],[113.247218, 23.147675],[113.247239, 23.14767],[113.247348, 23.147642],[113.24738, 23.147637],[113.247428, 23.147629],[113.248704, 23.147641],[113.24875, 23.147646],[113.248784, 23.14765],[113.248794, 23.147651],[113.248806, 23.147653],[113.248828, 23.147659],[113.248863, 23.147669],[113.248888, 23.147634],[113.248902, 23.14768],[113.248939, 23.14769],[113.24895, 23.147693],[113.248964, 23.147697],[113.248971, 23.147699],[113.248981, 23.147702],[113.249014, 23.147711],[113.24904, 23.147718],[113.249087, 23.147737],[113.249133, 23.147754],[113.249148, 23.14776],[113.249299, 23.147829],[113.24941, 23.147884],[113.249437, 23.147892],[113.249538, 23.147934],[113.249715, 23.148028],[113.249768, 23.148052],[113.250643, 23.148446],[113.250844, 23.148537],[113.250865, 23.148546],[113.250911, 23.148565],[113.250957, 23.148575],[113.251003, 23.148595],[113.251044, 23.148622],[113.251089, 23.148643],[113.25114, 23.148668],[113.251192, 23.148692],[113.251227, 23.148703],[113.251262, 23.148673],[113.251284, 23.148617],[113.251384, 23.148359],[113.251453, 23.148178],[113.251626, 23.147598],[113.251228, 23.147481],[113.251206, 23.147474],[113.251201, 23.147472],[113.251175, 23.147459],[113.251172, 23.147437],[113.251167, 23.147406],[113.251166, 23.147401],[113.251171, 23.147381],[113.251183, 23.147329],[113.251188, 23.14731],[113.251192, 23.147289],[113.251195, 23.147279],[113.251201, 23.147253],[113.251203, 23.147246],[113.251212, 23.147218],[113.25122, 23.147193],[113.251236, 23.147142],[113.251244, 23.147117],[113.251252, 23.147094],[113.251999, 23.145916],[113.252581, 23.145926],[113.253301, 23.145268],[113.252918, 23.144953],[113.252772, 23.144843],[113.252763, 23.144837],[113.251924, 23.144185],[113.251878, 23.144146],[113.251895, 23.144097],[113.251908, 23.144086],[113.251976, 23.144028],[113.251982, 23.144023],[113.25205, 23.143954],[113.252173, 23.143827],[113.252051, 23.143614],[113.252329, 23.142935],[113.252208, 23.142422],[113.252564, 23.14186],[113.25311, 23.141795],[113.253249, 23.141597],[113.253336, 23.140522],[113.253536, 23.139828],[113.253458, 23.139692],[113.253413, 23.139644],[113.253388, 23.139618],[113.253368, 23.139596],[113.253324, 23.139551],[113.253284, 23.139509],[113.253279, 23.139504],[113.253234, 23.139456],[113.252459, 23.139027],[113.251599, 23.138376],[113.250914, 23.138102],[113.24969, 23.137862],[113.245021, 23.13767],[113.244639, 23.137548],[113.243452, 23.136706],[113.243295, 23.136594],[113.243118, 23.13644],[113.243103, 23.136407],[113.243086, 23.136359],[113.243086, 23.136314],[113.243094, 23.136274],[113.243107, 23.136254],[113.245176, 23.13512],[113.245211, 23.135102],[113.245347, 23.135029],[113.245738, 23.134835],[113.245759, 23.134821],[113.245767, 23.134805],[113.245776, 23.134789],[113.245782, 23.134763],[113.245784, 23.134754],[113.245776, 23.134688],[113.245766, 23.134654],[113.245762, 23.134638],[113.245758, 23.134623],[113.245752, 23.134614],[113.245741, 23.134598],[113.245728, 23.13458],[113.245721, 23.134551],[113.245686, 23.134522],[113.245652, 23.134479],[113.245636, 23.134459],[113.24529, 23.133773],[113.245645, 23.133744],[113.246253, 23.133169],[113.246557, 23.133028],[113.246907, 23.132311],[113.246938, 23.132239],[113.246984, 23.132133],[113.246999, 23.132098],[113.247017, 23.132063],[113.247112, 23.131876],[113.247852, 23.131496],[113.247926, 23.131423],[113.247994, 23.131397],[113.248063, 23.131365],[113.248147, 23.131348],[113.248929, 23.130971],[113.248943, 23.130964],[113.249104, 23.130887],[113.250797, 23.13007],[113.250972, 23.129986],[113.251568, 23.129626],[113.251734, 23.129526],[113.252415, 23.129114],[113.253249, 23.128854],[113.253257, 23.128851],[113.2533, 23.128841],[113.253442, 23.128838],[113.254698, 23.128847],[113.254459, 23.125382],[113.254345, 23.125266],[113.254425, 23.125144],[113.254416, 23.125112],[113.254171, 23.124246],[113.254118, 23.124059],[113.253596, 23.122273],[113.253536, 23.122088],[113.253347, 23.12125],[113.253333, 23.121188],[113.253338, 23.121152],[113.253321, 23.121132],[113.253304, 23.121061],[113.253257, 23.120873],[113.253209, 23.120685],[113.253012, 23.119906],[113.252964, 23.119719],[113.252744, 23.118854],[113.252744, 23.118345],[113.252744, 23.118151],[113.252778, 23.11721],[113.252783, 23.117169],[113.252805, 23.117018],[113.252811, 23.116977],[113.252942, 23.116062],[113.252969, 23.115871],[113.252709, 23.114989],[113.252735, 23.114366],[113.252882, 23.113834],[113.252933, 23.113647],[113.253343, 23.112851],[113.253455, 23.112085],[113.253472, 23.111961],[113.253484, 23.111893],[113.253564, 23.111174],[113.25358, 23.110982],[113.253845, 23.108775],[113.25385, 23.108734],[113.253855, 23.108694],[113.253868, 23.108583],[113.253872, 23.108554],[113.253875, 23.108542],[113.253886, 23.108502],[113.254043, 23.108296],[113.254161, 23.10821],[113.254201, 23.108181],[113.254206, 23.108026],[113.254245, 23.107145],[113.250614, 23.105793],[113.250507, 23.105751],[113.25046, 23.105732],[113.250433, 23.105722],[113.250407, 23.105713],[113.250346, 23.105691],[113.250325, 23.105684],[113.250226, 23.105648],[113.250166, 23.105621],[113.248438, 23.104916],[113.245817, 23.10414],[113.244168, 23.103694],[113.242077, 23.10328],[113.242389, 23.103004],[113.243916, 23.1009],[113.245513, 23.098267],[113.247656, 23.09531],[113.248532, 23.093931],[113.252082, 23.082478],[113.252359, 23.081753],[113.252821, 23.080969],[113.252941, 23.080754],[113.253036, 23.080624],[113.253722, 23.079423],[113.255554, 23.076356],[113.256448, 23.074823],[113.256639, 23.074452],[113.257455, 23.073208],[113.25771, 23.072872],[113.258335, 23.072065],[113.258422, 23.071969],[113.258865, 23.071507],[113.25896, 23.071389],[113.259342, 23.070938],[113.260011, 23.07017],[113.260784, 23.069314],[113.260836, 23.069262],[113.261105, 23.068963],[113.261721, 23.068266],[113.262173, 23.067776],[113.262477, 23.067469],[113.262511, 23.067432],[113.263189, 23.066636],[113.263441, 23.066336],[113.263649, 23.066091],[113.264335, 23.065371],[113.265082, 23.064678],[113.265421, 23.064364],[113.266237, 23.063721],[113.266446, 23.063543],[113.266637, 23.063424],[113.267062, 23.063092],[113.267314, 23.062928],[113.267557, 23.062684],[113.268782, 23.061869],[113.269138, 23.061617],[113.269346, 23.061463],[113.269711, 23.061213],[113.270284, 23.060821],[113.270892, 23.060359],[113.270936, 23.060315],[113.270962, 23.060289],[113.271535, 23.059777],[113.271761, 23.059538],[113.272343, 23.059001],[113.273542, 23.057924],[113.274002, 23.057501],[113.274359, 23.057156],[113.274437, 23.057068],[113.275436, 23.056124],[113.275705, 23.05584],[113.276053, 23.055456],[113.276618, 23.054772],[113.27673, 23.054636],[113.276887, 23.054442],[113.276513, 23.054357],[113.274845, 23.053982],[113.273394, 23.053602],[113.271109, 23.052849],[113.269033, 23.05209],[113.266948, 23.051329],[113.265081, 23.050571],[113.263214, 23.049619],[113.261338, 23.048668],[113.259471, 23.047725],[113.257804, 23.046774],[113.256124, 23.043913],[113.255802, 23.044409],[113.255317, 23.044659],[113.254929, 23.044834],[113.254078, 23.044747],[113.250326, 23.043927],[113.245352, 23.043372],[113.233674, 23.042856],[113.225739, 23.041862],[113.221039, 23.042476],[113.214493, 23.042986],[113.211694, 23.043319],[113.209224, 23.04448],[113.203339, 23.050599],[113.199656, 23.053436],[113.195765, 23.056172],[113.191086, 23.057644],[113.188183, 23.058238],[113.184839, 23.059646],[113.182431, 23.061477],[113.180611, 23.063169],[113.177917, 23.068027],[113.17757, 23.069573],[113.177701, 23.070387],[113.177961, 23.0716],[113.178203, 23.072685],[113.178766, 23.073459],[113.179009, 23.074264],[113.178862, 23.074762],[113.17719, 23.076689],[113.17712, 23.077153],[113.177407, 23.077556],[113.178212, 23.077679],[113.181392, 23.077516],[113.183411, 23.077856],[113.185915, 23.07903],[113.1893, 23.081231],[113.191764, 23.082834],[113.193653, 23.083885],[113.19523, 23.084099],[113.205291, 23.08388],[113.205445, 23.083872],[113.205484, 23.08387],[113.205638, 23.083862],[113.206999, 23.083793],[113.208255, 23.083474],[113.208813, 23.083551],[113.209269, 23.085581],[113.209218, 23.085746],[113.209287, 23.08621],[113.209591, 23.086907],[113.210327, 23.087481],[113.212503, 23.088324],[113.212798, 23.088506],[113.213171, 23.089084],[113.213127, 23.089451],[113.212105, 23.090346],[113.211991, 23.09057],[113.212078, 23.090984],[113.213101, 23.092417],[113.213146, 23.092491],[113.213151, 23.092499],[113.21317, 23.092663],[113.213257, 23.092676],[113.213263, 23.092685],[113.213293, 23.093421],[113.213283, 23.093615],[113.213249, 23.094227],[113.212876, 23.094525],[113.212816, 23.095171],[113.212893, 23.095471],[113.213102, 23.095671],[113.213864, 23.095928],[113.215269, 23.096048],[113.215945, 23.096355],[113.216205, 23.096532],[113.216353, 23.096767],[113.216734, 23.098661],[113.216708, 23.099326],[113.216535, 23.099836],[113.21611, 23.100404],[113.215807, 23.100671],[113.213847, 23.099801],[113.212738, 23.099603],[113.211845, 23.099574],[113.208144, 23.099681],[113.208061, 23.100167],[113.208029, 23.100359],[113.206792, 23.107655],[113.206447, 23.108067],[113.206322, 23.108217],[113.205273, 23.109467],[113.205241, 23.109506],[113.205227, 23.109653],[113.205217, 23.109763],[113.205199, 23.109956],[113.205149, 23.110489],[113.20513, 23.110682],[113.204921, 23.112908],[113.204661, 23.114003],[113.204616, 23.114192],[113.20403, 23.116664],[113.204002, 23.116781],[113.203985, 23.116852],[113.203958, 23.116969],[113.203804, 23.117617],[113.203759, 23.117805],[113.203292, 23.119776],[113.202469, 23.121114],[113.203717, 23.121872],[113.209714, 23.121848],[113.210547, 23.12337],[113.211605, 23.128883],[113.212463, 23.136315],[113.212671, 23.141104],[113.213712, 23.1417],[113.214891, 23.146171],[113.215411, 23.148673],[113.215854, 23.149534],[113.216452, 23.149992],[113.216851, 23.149758],[113.218133, 23.148144],[113.220483, 23.144502],[113.221584, 23.143494],[113.223734, 23.141978],[113.224714, 23.140954],[113.225468, 23.139931],[113.227697, 23.138044],[113.228339, 23.139218],[113.228885, 23.139995],[113.229397, 23.140633],[113.230034, 23.141213],[113.230091, 23.141255],[113.230119, 23.141276],[113.230188, 23.14133],[113.230264, 23.141388],[113.230273, 23.141394],[113.230306, 23.141417],[113.230342, 23.141442],[113.230464, 23.141529],[113.231479, 23.142235],[113.233283, 23.143742],[113.234966, 23.145567],[113.236184, 23.147126],[113.236233, 23.147194],[113.236298, 23.147282],[113.236337, 23.147335],[113.236347, 23.14735],[113.236814, 23.148134],[113.237066, 23.149031],[113.237109, 23.150656],[113.237569, 23.152573],[113.237586, 23.153157],[113.237466, 23.154016],[113.237465, 23.154041],[113.237457, 23.154093],[113.237448, 23.154162],[113.237448, 23.154209],[113.237448, 23.154267],[113.237448, 23.154287],[113.237664, 23.155524],[113.238159, 23.156598],[113.241395, 23.157946],[113.242037, 23.158393],[113.242662, 23.159016],[113.242879, 23.159613]];
// for (var i = 0; i < arrPoint.length; i++) {
//   var position = arrPoint[i];
//   var marker = new AMap.Marker({position : position});
//   map.add(marker);
// }



 

// creatRoute(routeArr);
