import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Registro } from 'src/app/models/registro.model';
import { DataLocalService } from '../../services/data-local.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(private barcodeScanner: BarcodeScanner,
              private _data: DataLocalService) {}


  ionViewDidEnter() {
    // console.log('ionViewDidEnter');
    this.scan();
  }


  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      if ( !barcodeData.cancelled) {
        this._data.guardarRegistro(barcodeData.format, barcodeData.text);
      }
     }).catch(err => {
         console.log('Error', err);
         // this._data.abrirRegistro(new Registro('QRCode', 'https://github.com/KambouiTFG/wepay'));
         this._data.guardarRegistro('QRCode', 'geo:40.73151796986687,-74.06087294062502');
     });
  }

}
