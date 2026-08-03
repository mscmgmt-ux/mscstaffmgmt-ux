/**
 * Phase 0: 疎通確認専用のコード。
 * B-2（CORS）と B-3（Session.getActiveUser の挙動）の実地検証にのみ使う。
 * Phase 1 で本実装に置き換える。ここに秘密情報を書かない。
 */

function doGet(e) {
  var wantWhoami = e.parameter && e.parameter.whoami === '1';
  var payload = {
    ok: true,
    method: 'GET',
    ts: new Date().toISOString()
  };

  if (wantWhoami) {
    // 管理者用デプロイ（executeAs = USER_ACCESSING）でのみ意味を持つ確認。
    // スタッフ用デプロイ（executeAs = USER_DEPLOYING）だとオーナー自身のメールが返るはず。
    try {
      payload.email = Session.getActiveUser().getEmail();
    } catch (err) {
      payload.email = null;
      payload.error = String(err);
    }
  }

  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Content-Type: text/plain で送られてくる想定（CORS プリフライトを避けるため）。
  // JSON.parse できることを確認し、そのまま送り返す。
  var body = null;
  var parseError = null;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    parseError = String(err);
  }

  var payload = {
    ok: true,
    method: 'POST',
    contentType: e.postData ? e.postData.type : null,
    received: body,
    parseError: parseError,
    ts: new Date().toISOString()
  };

  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
