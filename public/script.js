const goToItem = (item) => {
  document.location.href = `/backup/details/${item.dataset.rowid}`;
};

const addBackup = () => {
  let dataToSend = {};

  let postDeLucru = document.querySelector('[name="postDeLucru"]').value;
  let denumirePc = document.querySelector('[name="denumirePc"]').value;
  let serialNo = document.querySelector('[name="serialNo"]').value;
  let nrInv = document.querySelector('[name="nrInv"]').value;
  let so = document.querySelector('[name="so"]').value;
  let status = document.querySelector('[name="status"]').value;
  let software = document.querySelector('[name="software"]').value;
  let sectia = document.querySelector('[name="sectia"]').value;

  dataToSend.postDeLucru = postDeLucru == '' ? 'n/a' : postDeLucru;
  dataToSend.denumirePc = denumirePc == '' ? 'n/a' : denumirePc;
  dataToSend.serialNo = serialNo == '' ? 'n/a' : serialNo;
  dataToSend.nrInv = nrInv == '' ? 'n/a' : nrInv;
  dataToSend.so = so == '' ? 'n/a' : so;
  dataToSend.status = status == '' ? 'n/a' : status;
  dataToSend.software = software == '' ? 'n/a' : software;
  dataToSend.sectia = sectia;

  if (sectia == 'none') return;

  fetch(`http://${window.location.host}/backup/add`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(dataToSend),
  })
    .then((res) => res.json())
    // .then((data) => console.log(data))
    .then(document.location.replace('/'))
    .catch((err) => console.log(err));
};

const deleteBacup = (item) => {
  fetch(`http://${window.location.host}/backup/delete/${item}`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    // .then((data) => console.log(data))
    .then(document.location.replace('/'))
    .catch((err) => console.log(err));
};

const goBackup = () => {
  document.location.href = '/backup/add';
};

const goSectia = (sectia) => {
  document.location.href = `/sectia/${sectia}`;
};
