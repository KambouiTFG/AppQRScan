import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';





@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  guardados: Registro[] = [];

  constructor(private storage: Storage,
              private navCtrl: NavController,
              private iab: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) {
    this.cargarRegistros();
  }

  async guardarRegistro(format: string, text: string) {
    await this.cargarRegistros();

    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    this.storage.set('scan-registros', this.guardados);
    // console.log(this.guardados);

    this.abrirRegistro(nuevoRegistro);
  }

  async cargarRegistros() {
    this.guardados =  await this.storage.get('scan-registros') || [];
  }

  abrirRegistro(registro: Registro){
    this.navCtrl.navigateForward('/tabs/tab2');

    switch( registro.type ){
      case 'http':
        // abrir nav web
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        // mapa
        break;

      default:
        // nose
    }
  }


  enviarCorreo() {
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    this.guardados.forEach( registro => {
      const linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',' , ' ')}\n`;
      arrTemp.push(linea);
    });

    this.crearArchivoFisico(arrTemp.join(''))
  }

  crearArchivoFisico(text: string) {
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
    .then( existe => {
      console.log('existe archivo?', existe);
      return this.escribirEnArchivo(text);
    })
    .catch( err => {
      return this.file.createFile( this.file.dataDirectory, 'registros.csv', false)
              .then( creado => this.escribirEnArchivo( text ))
              .catch( err2 => {
                console.log('no se pudo crear el archivo');
              });
    });
  }

  async escribirEnArchivo(text: string){
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);
    console.log('Archivo creado');
    const archivo = `${this.file.dataDirectory}/registros.csv`;
    // console.log(this.file.dataDirectory + 'registros.csv');

    const email = {
      // to: '',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backups QrScan',
      body: 'Historial de escaneos - <strong>AppScan</strong>',
      isHtml: true
    }
    
    // Send a text message using default options
    await this.emailComposer.open(email);
  }
}
