import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Container, Row, Col } from 'reactstrap';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
import _ from 'lodash';
let API_URL = 'http://localhost:3001'

class App extends Component {

  constructor() {
    super()
    this.dataMap = {};
    this.state = {

    }
  }


  getOptionLine() {
    return {
      title: {
        text: 'Total geral de viagens por mês',
        subtext: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Total']
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
            title: 'zoom'
          },
          magicType: {
            type: ['line', 'bar'],
            title: {
              line:'Exibir em linhas',
              bar:'Exibir em barras'
            }
          },
          restore: {
            title: 'Restaurar'
          },
          saveAsImage: {
            title: 'Salvar'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'junho', 'Julho', 'Agosto', 'Setembro', 'Novembro', 'Dezembro']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'Total',
          type: 'line',
          data: this.state.geralMeses || [],
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Mês com maior numero de viagem' },
              [{
                symbol: 'circle',
                x: '90%',
                yAxis: 'max'
              }, {
                symbol: 'circle',
                label: {
                  normal: {
                    position: 'start',
                    formatter: 'Total Maximo'
                  }
                },
                type: 'max',
                name: '最高点'
              }],
              [{
                symbol: 'circle',
                x: '90%',
                yAxis: 'min'
              }, {
                symbol: 'circle',
                label: {
                  normal: {
                    position: 'start',
                    formatter: 'Total Minimo'
                  }
                },
                type: 'min',
                name: '最高点'
              }]
            ]
          }
        },
      ]
    };
  }
  getOption() {
    var dataMap = {};
    return {
      baseOption: {
        timeline: {
          y: 0,
          axisType: 'category',
          realtime: false,
          // loop: false,
          autoPlay: true,
          // currentIndex: 2,
          playInterval: 2000,
          controlStyle: {
            position: 'left'
          },
          data: [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
          ],

        },
        title: {
          subtext: ''
        },
        tooltip: {
        },
        calculable: false,
        grid: {
          show: true,
          top: 80,
          bottom: 100,
          left: 60,
          width: 2000,

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              padding: '1',

              label: {
                show: true,
                formatter: function (params) {
                  return params.value.replace('\n', '');
                }
              }
            }
          }
        },
        xAxis: [
          {
            'type': 'category',
            'gridIndex': 0,
            'axisLabel': {
              'interval': 'auto',
              'rotate': 30,
              'height': 1,
              'padding': 0,


            },
            'axisTick': {
              show: false,
            },
            splitNumber: 20,
            scale: true,


            'data': this.state.siglas || [],


          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Total'
          }
        ],
        series: [
          {
            name: 'Total Viagens',
            type: 'bar',
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }

          },


        ]
      },
      options: this.state.resultados
    }
  }

  componentDidMount() {
    axios.get(API_URL + '/dados/meses').then((result) => {
      let dados = result.data
      this.setState({
        geralMeses: dados
      })
    })

    axios.get(API_URL + '/dados/meses/orgao').then((result) => {
      let dados = result.data
      let resultados = []
      _.forIn(dados.valores, (item, key) => {
        let obj = {
          title: { text: key },
          series: [
            { data: item },

          ]
        };
        resultados.push(obj);
      })
      this.setState({
        siglas: dados.labels,
        resultados: resultados
      })

    })
  }
  render() {
    return (
      <Container fluid={true}>
        <Col lg="12">
          <div className="m-t-10">
            <div className="chart-panel">

              <ReactEcharts
                style={{ height: '500px', width: '100%' }}
                option={this.getOptionLine()} />

            </div>

          </div>
        </Col>
        <Col lg="12">
          <div className="m-t-10">
            <div className="chart-panel">

              <ReactEcharts
                style={{ height: '500px', width: '100%' }}
                option={this.getOption()} />

            </div>

          </div>
        </Col>

      </Container>
    );
  }
}

export default App;
