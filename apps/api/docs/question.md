# Question?

- rollback voucher
  > ketika transaksi gagal (karena timeout), apakah point, diskon voucher 10%, dan diskon promo by promotor tuh kena rollback ga kak?

- voucher rules
  - single use
    - vs
  - bisa berkali2

- one user buy one ticket/event
  - vs
- one user buy many tickets/event




- points/vouchers hanya akan ke delete ketika expired, nah ketika dia success dia akan delete event scheduler nya. namun apabila transaksi itu batal, dia hanya akan merubah status voucher ke available

### update

- ketika transaction complete, semua voucher yang dipakai akan di delete. kenapa? karena semua effect vouchers telah disimpan di total diskon. 