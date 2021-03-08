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

const checkCNH = (motorista, veiculo) => {
  if (motorista == null || veiculo == null) return false;

  switch (veiculo) {
    case 'A':
      return ['A', 'AB', 'AC', 'AD', 'AE'].includes(motorista);
    case 'B':
      return ['B', 'AB', 'AC', 'AD', 'AE', 'C', 'D', 'E'].includes(motorista);
    case 'C':
      return ['C', 'AC', 'AD', 'AE', 'D', 'E'].includes(motorista);
    case 'D':
      return ['D', 'AD', 'E', 'AE'].includes(motorista);
    case 'E':
      return ['E', 'AE'].includes(motorista);
    default:
      return false;
  }
};

module.exports = validar_data;
module.exports = checkCNH;
