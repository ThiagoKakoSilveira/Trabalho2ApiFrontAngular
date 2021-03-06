import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ToastyService } from 'ng2-toasty';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaService } from './../pessoa.service';
import {Pessoa} from './../../core/model';
import {stringDistance} from 'codelyzer/util/utils';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();
  estados: any[];

  constructor(
    private pessoaService: PessoaService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova pessoa');

    // this.carregarEstados();

    // this.consultaCep();

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }
  }

  // carregarEstados() {
  //   this.pessoaService.listarEstados().then(lista => {
  //     console.log(lista);
  //     this.estados = lista.map(uf => ({label: uf.nome, value: uf.id}));
  //     this.estados.unshift({label: 'Selecione um Estado', id: null});
  //     console.log(this.estados);
  //   }).catch(erro => this.errorHandler.handle(erro));
  // }

  consultaCep(cep) {
  // consultaCep() {
    // this.pessoaService.buscarEndereco()
    this.pessoaService.buscarEndereco(cep)
      .then(response => {
        console.log(response);
        this.pessoa.endereco.logradouro = response.logradouro;
        this.pessoa.endereco.bairro = response.bairro;
        this.pessoa.endereco.cidade = response.localidade;
        this.pessoa.endereco.estado = response.uf;
        console.log(this.pessoa);
      })
      .catch(erro => this.errorHandler.handle(erro));
    // console.log(cep);

  }

  get editando() {
    return Boolean(this.pessoa.codigo)
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
      .then(pessoa => {
        this.pessoa = pessoa;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: FormControl) {
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.toasty.success('Pessoa adicionada com sucesso!');
        this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarPessoa(form: FormControl) {
    this.pessoaService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.toasty.success('Pessoa alterada com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  nova(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['/pessoas/nova']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }
}
