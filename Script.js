let produk =
JSON.parse(
localStorage.getItem("produk")
|| "[]"
);

let transaksi =
JSON.parse(
localStorage.getItem("transaksi")
|| "[]"
);

let total = 0;

function simpan(){

localStorage.setItem(
"produk",
JSON.stringify(produk)
);

localStorage.setItem(
"transaksi",
JSON.stringify(transaksi)
);

}

function tambahProduk(){

if(!nama.value) return;

produk.push({

nama:nama.value,

modal:+modal.value,

harga:+harga.value,

stok:+stok.value

});

nama.value="";
modal.value="";
harga.value="";
stok.value="";

simpan();

renderProduk();

}

function renderProduk(){

let q =
document
.getElementById("cari")
.value
.toLowerCase();

produkBody.innerHTML="";

produk
.filter(
p=>p.nama.toLowerCase().includes(q)
)

.forEach((p,i)=>{

let warning =
p.stok<=5
?
"⚠"
:
"";

produkBody.innerHTML += `
<tr>

<td>${p.nama}</td>

<td>Rp${p.harga}</td>

<td>${p.stok} ${warning}</td>

<td>

<button onclick="jual(${i})">
Jual
tampilkanRiwayat();
</button>

<button onclick="hapus(${i})">
Hapus
</button>

</td>

</tr>
`;

});

jmlProduk.innerText =
produk.length;

}

function jual(i){

if(produk[i].stok<1){

alert("Stok habis");

return;

}

produk[i].stok--;

total += produk[i].harga;

transaksi.push({

nama:produk[i].nama,

harga:produk[i].harga,

modal:produk[i].modal,

tanggal:new Date()
.toLocaleString()

});

keranjang.innerHTML +=
`<div>
${produk[i].nama}
-
Rp${produk[i].harga}
</div>`;

document
.getElementById("total")
.innerText = total;

document.body.animate(
[
{transform:'scale(1)'},
{transform:'scale(1.01)'},
{transform:'scale(1)'}
],
{
duration:250
}
);

simpan();

renderProduk();

laporan();

}

function hapus(i){

produk.splice(i,1);

simpan();

renderProduk();

laporan();

}

function laporan(){

let jual =
transaksi.reduce(
(a,b)=>a+b.harga,
0
);

let modal =
transaksi.reduce(
(a,b)=>a+b.modal,
0
);

penjualan.innerText =
"Rp"+jual;

keuntungan.innerText =
"Rp"+(jual-modal);

}

function backup(){

let data = {
produk,
transaksi
};

let blob =
new Blob(
[JSON.stringify(data,null,2)],
{
type:'application/json'
}
);

let a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"backup-kasir.json";

a.click();

}

function darkMode(){

document.body.classList.toggle(
"dark"
);

}

renderProduk();

laporan();
function tampilkanRiwayat(){

    let body =
    document.getElementById(
        "riwayatBody"
    );

    body.innerHTML = "";

    transaksi
    .slice()
    .reverse()
    .forEach(t=>{

        body.innerHTML += `
        <tr>
            <td>${t.tanggal}</td>
            <td>${t.nama}</td>
            <td>Rp${t.harga}</td>
        </tr>
        `;

    });

}tampilkanRiwayat();
function exportExcel(){

    let data = transaksi.map(t=>({

        Tanggal:t.tanggal,

        Barang:t.nama,

        Harga:t.harga

    }));

    let wb =
    XLSX.utils.book_new();

    let ws =
    XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Transaksi"
    );

    XLSX.writeFile(
        wb,
        "LaporanKasir.xlsx"
    );

}
function restoreBackup(event){

    let file =
    event.target.files[0];

    if(!file) return;

    let reader =
    new FileReader();

    reader.onload =
    function(e){

        let data =
        JSON.parse(
            e.target.result
        );

        produk =
        data.produk || [];

        transaksi =
        data.transaksi || [];

        simpan();

        renderProduk();

        laporan();

        tampilkanRiwayat();

        alert(
        "Backup berhasil dipulihkan"
        );

    };

    reader.readAsText(file);

}