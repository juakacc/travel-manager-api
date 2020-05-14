const padrao = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/;
const padrao2 = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/; // app antigo

// 2020-05-14T10:29:10-03:00 adicionar verificação de timezone

const validar_data = (date) => {
  const data = date.replace("T", " ");
  const s = new Date(data);

  if ((!padrao.test(data) && !padrao2.test(data)) || isNaN(s.getTime())) {
    return false;
  } else {
    return true;
  }
};

module.exports = validar_data;
