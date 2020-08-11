[CmdletBinding()]
param (
  [Parameter()]
  [DateTime]
  $StartDate,
  [Parameter()]
  [DateTime]
  $EndDate
)

if ($PSBoundParameters.ContainsKey('StartDate') -eq $False) {
  $StartDate = Get-Date
}

if ($PSBoundParameters.ContainsKey('EndDate') -eq $False) {
  $EndDate = $StartDate
}

$FirstDate = $StartDate

while ($FirstDate -le $EndDate) {
  $StatDate = $FirstDate.AddDays(-1).ToString('yyyyMMdd')
  $MatchupDate = $FirstDate.ToString('yyyyMMdd')

  $response = Invoke-RestMethod "http://homedesk:1946/teams/advancedStats/$StatDate" -Method 'POST'
  if ($response.wasSuccessful) {
    Write-Output "Advanced stats loaded for $StatDate"
  }
  $response = Invoke-RestMethod "http://homedesk:1946/boxscores/$StatDate" -Method 'POST'
  if ($response.wasSuccessful) {
    Write-Output "Box scores loaded for $StatDate"
  }
  $response = Invoke-RestMethod "http://homedesk:1946/matchups/$MatchupDate" -Method 'POST' 
  if ($response.wasSuccessful) {
    Write-Output "Matchups loaded for $MatchupDate"
  }
  
  $FirstDate = $FirstDate.AddDays(1)
}
