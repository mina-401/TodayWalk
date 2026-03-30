$(document).ready(function () {

  const KAKAO_JS_KEY = '226c5b7387fc287b4905522ff5fe574a';

  const script = document.createElement('script');
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false`;
  script.onload = () => kakao.maps.load(initMap);
  document.head.appendChild(script);

  let map, ps, marker;

  function initMap() {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.9780),
      level: 5
    };

    map = new kakao.maps.Map(container, options);
    ps = new kakao.maps.services.Places();

    showStatus('지도가 로드되었습니다');
  }

  $('#btn-search').on('click', doSearch);
  $('#search-input').on('keypress', e => { if (e.key === 'Enter') doSearch(); });

  function doSearch() {
    const keyword = $('#search-input').val().trim();
    if (!keyword) return;

    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const place = data[0];
        const pos = new kakao.maps.LatLng(place.y, place.x);

        if (marker) marker.setMap(null);

        marker = new kakao.maps.Marker({ map, position: pos });
        map.setCenter(pos);
        map.setLevel(3);

        const infoWindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:8px 12px;font-size:13px;font-weight:700;">${place.place_name}</div>`
        });

        infoWindow.open(map, marker);
        showStatus(place.place_name);
      } else {
        showStatus('검색 결과가 없습니다');
      }
    });
  }

  $('#btn-locate').on('click', () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const myPos = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      if (marker) marker.setMap(null);

      marker = new kakao.maps.Marker({ map, position: myPos });
      map.setCenter(myPos);
      map.setLevel(3);

      showStatus('현재 위치로 이동했습니다');
    });
  });

  let statusTimer;
  function showStatus(msg) {
    clearTimeout(statusTimer);
    $('#status').text(msg).addClass('show');
    statusTimer = setTimeout(() => $('#status').removeClass('show'), 2500);
  }

});