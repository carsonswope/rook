# Why is Invoke-WebRequest so slow???

Function post($params) {
  $username = $params[0]
  $s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $c = New-Object System.Net.Cookie('rook_username',$username,'/','localhost')
  $s.Cookies.Add($c)
  $url = $params[1]
  $body = $params[2]
  return Invoke-RestMethod -uri ('http://localhost:4200' + $url) `
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
  return Invoke-RestMethod -uri ('http://localhost:4200' + $url) `
	-Method 'GET' `
	-ContentType 'application/json; charset=utf-8' `
	-WebSession $s
}

$u1 = 'swope'
$u2 = 'p2'
$u3 = 'p3'
$u4 = 'p4'

$a = post($u1, '/api/matches', '{"matchId": "goodgame"}')
$a = post($u2, '/api/join_match', '{"matchId": "goodgame", "seatId":1}')
$a = post($u3, '/api/join_match', '{"matchId": "goodgame", "seatId":2}')
$a = post($u4, '/api/join_match', '{"matchId": "goodgame", "seatId":3}')

$resp = post($u1, '/api/start_match', '{"matchId": "goodgame"}')
$gameId = $resp.gameIds[0]

$move_body = @{
  matchId='goodgame'
  gameId=$gameId
    move=@{
      moveType=1 #bid
      bid=15
    }
  }
post($u2, '/api/game/move', ($move_body | ConvertTo-Json))

# pass!
$move_body.move.bid = 0
post($u3, '/api/game/move', ($move_body | ConvertTo-Json))


$move_body.move.bid = 25
post($u4, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 130
post($u1, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 140
post($u2, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 0
post($u4, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 0
post($u1, '/api/game/move', ($move_body | ConvertTo-Json))

# bidding concluded!