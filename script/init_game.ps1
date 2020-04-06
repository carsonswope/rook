# Why is Invoke-WebRequest so slow???

Function post($params) {
  $username = $params[0]
  $s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $c = New-Object System.Net.Cookie('rook_username',$username,'/','localhost')
  $s.Cookies.Add($c)
  $url = $params[1]
  $body = $params[2]
  Invoke-WebRequest ('http://localhost:4200' + $url) `
	-Body $body `
	-Method 'POST' `
	-ContentType 'application/json; charset=utf-8' `
	-WebSession $s
}

Function get($params) {
  $username = $params[0]
  $s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $c = New-Object System.Net.Cookie('rook_username',$username,'/','localhost')
  $s.Cookies.Add($c)
  $url = $params[1]
  Invoke-WebRequest ('http://localhost:4200' + $url) `
	-Method 'GET' `
	-ContentType 'application/json; charset=utf-8' `
	-WebSession $s
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
