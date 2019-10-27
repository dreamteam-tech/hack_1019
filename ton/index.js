const fs = require('fs');
const nacl = require('./nacl.min');
const ton = require('./tonCellobfuscated');

const base64abc = (() => {
  let abc = [],
    A = 'A'.charCodeAt(0),
    a = 'a'.charCodeAt(0),
    n = '0'.charCodeAt(0);
  for (let i = 0; i < 26; ++i) {
    abc.push(String.fromCharCode(A + i));
  }
  for (let i = 0; i < 26; ++i) {
    abc.push(String.fromCharCode(a + i));
  }
  for (let i = 0; i < 10; ++i) {
    abc.push(String.fromCharCode(n + i));
  }
  abc.push('+');
  abc.push('/');
  return abc;
})();

function bytesToBase64(bytes) {
  let result = '',
    i,
    l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
    result += base64abc[bytes[i] & 0x3f];
  }
  if (i === l + 1) {
    // 1 octet missing
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 0x03) << 4];
    result += '==';
  }
  if (i === l) {
    // 2 octets missing
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[(bytes[i - 1] & 0x0f) << 2];
    result += '=';
  }
  return result;
}

module.exports = {
  /**
   * Send tokens to user in Telegram Open Network
   */
  sendGrams: async (private_key_files, addr_key_files, address, amount, transfer_comment = '') => {
    let addr = false;
    if (private_key_files.length === 0) {
      new Error('Private key file is required');
    }
    const private_key = new ton.Uint8Array(await fs.readFileAsync(private_key_files[0]));
    if (private_key.length !== 32) {
      new Error('Unknown format of private key');
    }
    if (addr_key_files.length) {
      addr = await fs.readFileAsync(addr_key_files[0]);
      addr = new ton.Uint8Array(addr);
      console.log(addr);
      if (addr.length !== 36)
        new Error('Unknown format of account address');
    }
    const keyPair = nacl.sign.keyPair.fromSeed(private_key);

    let hex_addr = null;
    let wc = null;
    if (!addr) {
      const a = await ton.wallet_creation_generate_external_message(keyPair);
      hex_addr = a[0];
      wc = '0';
    } else {
      hex_addr = ton.bufferToHex2(addr.slice(0, 32));
      wc = 0;
      if (ton.bufferToHex2(addr.slice(32, 36)) !== '00000000')
        new Error(
          'As for now, service works only with basechain (chainindex 0). Sorry for inconvenience'
        );
    }
    const account = await ton.getaccount(wc + ':' + hex_addr);
    const seq_no = parseInt(account['meta']['seq_no']);
    const boc = await ton.wallet_send_generate_external_message(
      keyPair,
      address,
      amount,
      seq_no,
      transfer_comment
    );
    return await ton.sendboc(ton.hexToBuffer(boc));
  },

  /**
   * Create wallet in Telegram Open Network
   */
  createWallet: async () => {
    const keyPair = nacl.sign.keyPair();
    const priv_key_b64 = bytesToBase64(keyPair.secretKey.slice(0, 32));
    const privateKeyBase64String = `utf-16le;base64,${priv_key_b64}`;
    const [
      contract_address,
      contract_boc
    ] = await ton.wallet_creation_generate_external_message(keyPair);
    const wc = 0;

    // wallet.addr file
    const address_b64 = bytesToBase64(
      ton.concat_ui8a(ton.hexToBuffer(contract_address), new ton.Uint8Array([0, 0, 0, wc]))
    );
    const adr_form = await ton.give_non_bouncable(wc + ':' + contract_address);
    const testTonBot = '@test_ton_bot';
    const explorer_address = 'https://tonwatcher.com/index.html?account='+wc + ':' + contract_address;
    const officialExplorer = 'http://test.ton.org/testnet';

    let i = 0;
    let have_money = false;
    let account = null;
    while (!have_money) {
      // sleep(2000);
      account = await ton.getaccount(wc + ':' + contract_address);
      if ('meta' in account && 'balance' in account['meta']) have_money = true;
      i++;
      ton.poke_waiting_status();
    }
    await ton.sendboc(ton.hexToBuffer(contract_boc));

    const link = `${wc}:${contract_address} on ${explorer_address}`;

    return {
      link,
      officialExplorer,
      explorer_address,
      testTonBot,
      adr_form,
      address_b64,
      privateKeyBase64String,
      priv_key_b64,
      keyPair
    };
  },
};
