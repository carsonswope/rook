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

Function getGameState($username) {
  'Game state for ' + $username
  return get($username, '/api/match/goodgame/games')
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

getGameState($u1)
getGameState($u2)
getGameState($u3)
getGameState($u4)

$move_body = @{
  matchId='goodgame'
  gameId=$gameId
    move=@{
      moveType=1 #bid
      bid=15
    }
  }
post($u2, '/api/game/move', ($move_body | ConvertTo-Json))

# bid 0 == pass
$move_body.move.bid = 0
$r = post($u3, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 25
$r = post($u4, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 130
$r = post($u1, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 140
$r = post($u2, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 0
$r = post($u4, '/api/game/move', ($move_body | ConvertTo-Json))

$move_body.move.bid = 0
$r = post($u1, '/api/game/move', ($move_body | ConvertTo-Json))

# bidding concluded!
getGameState('unknown-user')
getGameState($u1)
'kitty should be visible on this one only:'
getGameState($u2)
getGameState($u3)
getGameState($u4)

