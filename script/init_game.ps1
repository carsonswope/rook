# Why is Invoke-WebRequest so slow???

Function post($params) {
  $username = $params[0]
  $url = $params[1]
  $body = $params[2]
  Invoke-WebRequest ('http://localhost:4200' + $url) `
	-Body $body `
	-Method 'POST' `
	-ContentType 'application/json; charset=utf-8' `
	-Headers @{'Cookie' = 'rook_username=' + $username}
}

Function get($params) {
  $username = $params[0]
  $url = $params[1]
  Invoke-WebRequest ('http://localhost:4200' + $url) `
	-Method 'GET' `
	-ContentType 'application/json; charset=utf-8' `
	-Headers @{'Cookie' = 'rook_username=' + $username}
}

$u1 = 'swope'
$u2 = 'p2'
$u3 = 'p3'
$u4 = 'p4'

post($u1, '/api/matches', '{"matchId": "goodgame"}')
post($u2, '/api/join_match', '{"matchId": "goodgame", "seatId":1}')
post($u3, '/api/join_match', '{"matchId": "goodgame", "seatId":2}')
post($u4, '/api/join_match', '{"matchId": "goodgame", "seatId":3}')

post($u1, '/api/start_match', '{"matchId": "goodgame"}')
