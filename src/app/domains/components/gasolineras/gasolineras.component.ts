import { Component, signal } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Gasofas } from '../../gasolineras/shared/product.model';

@Component({
  selector: 'app-gasolineras',
  standalone: true,
  imports: [],
  templateUrl: './gasolineras.component.html',
  styleUrl: './gasolineras.component.css'
})
export class GasolinerasComponent {

  data: any[] = [];

  provincias: any[] = [];
  
  municipios: any[] = [];

  ciudades: any[] = [];

  gasofas: any[] = [];


  private urlApiProvincias = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProvinciasPorComunidad/';
  private urlApiMunicipios = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/';
  private urlApiCiudad = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/';
  private urlApiGasofas = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/';

  private urlPronviaSeleccionada = this.urlApiProvincias;

  private urlMunicipioSeleccionada = this.urlApiMunicipios;

  private urlCiudadSeleccionada = this.urlApiCiudad;

  private urlGasofasSeleccionada = this.urlApiGasofas;

  constructor(private apiService: ProductService, private http: HttpClient){ }

  ngOnInit(): void{
    this.llenarData();
  }

  llenarData(){
    this.apiService.getData().subscribe(data => {
      this.data = data;
      console.log(this.data);
    })
  }

  selectProvincia(selectElement: HTMLSelectElement){
    this.botonSeleccionado = -1;
    this.provincias = [];
    const selectedValue = selectElement.value;
    this.urlPronviaSeleccionada = this.urlApiProvincias + selectedValue;
    this.getProvincias().subscribe(data => {
      this.provincias = data;
      console.log(this.provincias)
    })
  }

  selectMunicipio(selectElement: HTMLSelectElement){
    this.botonSeleccionado = -1;
    this.municipios = [];
    const selectedValue = selectElement.value;
    this.urlMunicipioSeleccionada = this.urlApiMunicipios + selectedValue;
    this.getMunicipios().subscribe(data => {
      this.municipios = data;
      console.log(this.municipios)
    })
  }

  selectCiudad(selectElement: HTMLSelectElement){
    this.botonSeleccionado = -1;
    this.ciudades = [];
    const selectedValue = selectElement.value;
    this.urlCiudadSeleccionada = this.urlApiCiudad + selectedValue;
    this.getCiudades().subscribe(data => {
      this.ciudades = data;
      console.log(this.ciudades)
    })
  }

  selectGasofa(selectElement: HTMLSelectElement){
    this.botonSeleccionado = -1;
    const selectedValue = selectElement.value;
    this.urlGasofasSeleccionada = this.urlApiGasofas + selectedValue;
    this.getGasofas().subscribe((data) => {
      this.gasofas = data.ListaEESSPrecio.map((gasofa: any) => ({ Municipio: gasofa.Municipio,
        Direccion: gasofa.Dirección, 
        Horario: gasofa.Horario,
         'Precio Gasolina 95 E5': gasofa['Precio Gasolina 95 E5'],
         'Precio Gasoleo A': gasofa['Precio Gasoleo A'],
         Provincia: gasofa.Provincia
         }));
      console.log(this.gasofas);
    })
  }

  botonSeleccionado: number = -1;

  filtrarPorPrecioGasolina() {
    this.botonSeleccionado = 0;
    this.gasofas.sort((a, b) => {
      const precioA = parseFloat(a['Precio Gasolina 95 E5'].replace(',', '.'));
      const precioB = parseFloat(b['Precio Gasolina 95 E5'].replace(',', '.'));
      return precioA - precioB;
    });
    console.log(this.gasofas);
  }
    
  
  filtrarPorPrecioGasoleo() {
    this.botonSeleccionado = 1;
    this.gasofas.sort((a, b) => {
      const precioA = parseFloat(a['Precio Gasoleo A'].replace(',', '.'));
      const precioB = parseFloat(b['Precio Gasoleo A'].replace(',', '.'));
      return precioA - precioB;
    });
  }

  filtrar24Horas() {
    this.botonSeleccionado = 2;
    this.gasofas = this.gasofas.filter(gasofa => /24H/i.test(gasofa.Horario));
    console.log(this.gasofas);
  }  

 public getProvincias(): Observable<any> {
    return this.http.get<any>(this.urlPronviaSeleccionada);
  }

  public getMunicipios(): Observable<any> {
    return this.http.get<any>(this.urlMunicipioSeleccionada);
  }

  public getCiudades(): Observable<any> {
    return this.http.get<any>(this.urlCiudadSeleccionada);
  }

  public getGasofas(): Observable<any> {
    return this.http.get<any>(this.urlGasofasSeleccionada);
  }

}
