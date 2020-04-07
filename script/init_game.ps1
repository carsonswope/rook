

Function post($params) {
  $username = $params[0]
  $s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $c = New-Object System.Net.Cookie('rook_username',$username,'/','localhost')
  $s.Cookies.Add($c)
  $url = $params[1]
  $body = $params[2]
  # point directly to server! not through whatever dev mode proxy was running at :4200
  return Invoke-RestMethod -uri ('http://localhost:3000' + $url) `
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
  return Invoke-RestMethod -uri ('http://localhost:3000' + $url) `
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

$r = getGameState($u1)
'hand '
$r.hands[0]
$r = getGameState($u2)
'hand '
$r.hands[1]
$r = getGameState($u3)
'hand '
$r.hands[2]
$r = getGameState($u4)
'hand '
$r.hands[3]

$move_body = @{
  matchId='goodgame'
  gameId=$gameId
    move=@{
      moveType=1 #bid
      bid=15
    }
  }
$r = post($u2, '/api/game/move', ($move_body | ConvertTo-Json))

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
$r = getGameState($u2)
$hand = $r.hands[1]
$kitty = $r.kitty

getGameState($u3)
getGameState($u4)


$move_body = @{
  matchId='goodgame'
  gameId=$gameId
    move=@{
      moveType=2 #discard
      discarded=($hand[0], $hand[1], $hand[4], $hand[7], $hand[8])
      trump=2 # green red BLACK yellow trump (can't call rook as trump, obviously)
    }
  }
$move_body.move
post($u2, '/api/game/move', ($move_body | ConvertTo-Json -Depth 2))