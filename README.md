# 2026/11/7 学校説明会 LP（小林聖心女子学院小学校）

- LP: https://oby-kouhou.github.io/oby-2026-1107-setsumei/
- go中継（ちらし・メール・LINE・HPなど配布済みのリンク）: `.../go/?s={source}` → LP（出どころを `?src=` で引き継ぐ。`?s=` はGA4がサイト内検索と数えるため使わない）。GA4 イベント `go_relay`（source）
- apply中継（LPの申込ボタン）: `.../apply/?s=lp_{source}` → ミライコンパス申込一覧。GA4 イベント `click_apply`（source、event_name_jp `setsumei_1107`）
- LP内の申込ボタン: GA4 イベント `cta_click`（cta_location: header / hero / outline / final / sticky）
- 広告からは LP に UTM を付けて誘導（`?utm_source=ig&utm_medium=paid&utm_campaign=1107_setsumei&utm_content=a|b`）。申込時の source は `lp_ig_a` などになる
- 申込締切 2026/11/6 9:00 を過ぎると、LP のボタンは自動で「受付は終了しました」に切り替わる
- GA4: G-WG4L0SGNJJ（プロパティ 533276091）
