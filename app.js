(function () {
    'use strict'

    angular.module('app', ['angucomplete-alt'])

    angular.module('app')
        .controller('mainController', ['$scope', '$http', mainController])

    function mainController($scope, $http) {
        $scope.departs = [];
        $scope.tasks = [];
        $scope.departs.push({ name: 'HR', tasks: [] })
        $scope.departs.push({ name: 'Pracownik', tasks: [] })

        $scope.flowList = [];

        var bpmnProcess = null;
        var xmlDoc = null;
        var xmlString = null;

        $scope.selectedTask = function (item) {
            var task1 = xmlDoc.createElement("bpmn-task");
            task1.id = item.originalObject.value;
            bpmnProcess.appendChild(task1);
            $scope.flowList.push(item);
        }

        $scope.showXML = function () {

            $("#xml-container").text(xmlString)
            
        }


        $scope.tasks = [{ name: 'Przygotowanie wniosku o urlop', value: 'przygotowanie_wniosku_o_urlop' }, 
        { name: 'Złożenie wniosku o urlop', value: 'zlozenie_wniosku_o_urlop' }, 
        { name: 'Weryfikacja wymagań formalnych złożonego wniosku', value: 'weryfikacja_wymagan_formalnych_zlozonego_wniosku' },
        { name: 'Rozpatrywanie wniosku o urlop', value: 'rozpatrywanie_wniosku_o_urlop' },
        { name: 'Pozytywne rozpatrzenie wniosku o urlop', value: 'pozytywne_rozpatrzenie_wniosku_o_urlop' },
        { name: 'Odrzucenie wniosku o urlop', value: 'odrzucenie_wniosku_o_urlop' },
        { name: 'Określenie potrzebnej ilości materiałów' , value: 'okreslenie_potrzebnej_ilosci_materialow'},
        { name: 'Ustalenie ilości materiałów', value: 'ustalenie_ilosci_materialow' },
        { name: 'Wybór dostawcy', value: 'wybor_dostawcy' },
        { name: 'Zatwierdzenie parametrów technicznych materiałów', value: 'zatwierdzenie_parametrow_technicznych_materialow' },
        { name: 'Analiza ofert od dostawców', value: 'analiza_ofert_od_dostawcow' },
        { name: 'Kontrola budżetu' , value: 'kontrola_budzetu'},
        { name: 'Zatwierdzenie dostawcy', value: 'zatwierdzenie_dostawcy' },
        { name: 'Odrzucenie dostawcy', value: 'odrzucenie_dostawcy' },]
        
        $scope.addDepart = function () {
            $scope.departs.push({ name: $scope.departName, tasks: [] })
        }

       

        function init() {
            var xmlString = "<bpmn-definitions xmlns-bpmn='http://www.omg.org/spec/BPMN/20100524/MODEL' xmlns-bpmndi='http://www.omg.org/spec/BPMN/20100524/DI' xmlns-di='http://www.omg.org/spec/DD/20100524/DI' xmlns-dc='http://www.omg.org/spec/DD/20100524/DC' id='Definitions_1' targetNamespace='http://bpmn.io/schema/bpmn' exporter='Camunda Modeler' exporterVersion='1.10.0'></bpmn-definitions>";
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlString, "text/xml");
            bpmnProcess = xmlDoc.createElement("bpmn-process");
            bpmnProcess.id = "Process_1";
            bpmnProcess.setAttribute('isExecutable', "true");
            var start = xmlDoc.createElement("bpmn-startEvent");
            start.id = "StartEvent_1";
            bpmnProcess.appendChild(start);
        }

        init();

        $scope.send = function () {


            var elements = xmlDoc.getElementsByTagName("bpmn-definitions");

            var end = xmlDoc.createElement("bpmn-endEvent");
            end.id = "EndEvent_1";
            bpmnProcess.appendChild(end);
            elements[0].appendChild(bpmnProcess);

            var node = document.createElement("Item");

            var serializer = new XMLSerializer();
            xmlString = serializer.serializeToString(xmlDoc);
            var re = new RegExp('-', 'g');
            xmlString = xmlString.replace(re, ':')
            console.log(xmlString)
            $http({
                url: 'http://localhost:3000/create-engine',
                dataType: 'json',
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: { xmlProcess: xmlString }
            }).then(function(){
                $('.flow-task').addClass('executedTask');
            })

        }

        $scope.deleteTask = function(task){
            $scope.flowList = $scope.flowList.filter(function(item){
                return item.title != task.title;
            });
            var element = bpmnProcess.querySelector("#" + task.originalObject.value);
            element.parentNode.removeChild(element);
        }

        $scope.getLeftPosition = function(index){
            return {
                left: index * 200 + 'px'
            }
        }

    }
})()
