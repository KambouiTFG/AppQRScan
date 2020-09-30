import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public _data: DataLocalService) {}

  enviarCorreo() {
    console.log('enviando correo');
    this._data.enviarCorreo();
  }

  abrirRegistro(registro: Registro) {
    console.log('REGISTRO: ', registro);
    this._data.abrirRegistro(registro);
  }

}
