
class Component{
    constructor(hostElementId,insertBefore=false){
        if(hostElementId){
            this.hostElement=document.getElementById(hostElementId)
        }else{
            this.hostElement=document.body;
        }
        this.insertBefore=insertBefore
    }

    detach(){
        if(this.element){
            this.element.remove(); 
        }
       

    }
  //moreiNFO
  attach(){
    this.hostElement.insertAdjacentElement(this.insertBefore?'afterbegin':'beforeend',this.element)
    // document.body.append(this.element)
  }
}


class Tooltip extends Component{
    constructor(closeNotifierFunction){
        super();
        this.closeNotifier=closeNotifierFunction;
        this.create();
    }
    closeTooltip(){
        this.detach();
        this.closeNotifier()
    }

    create(){
        console.log('The Tooltip....')
        const tooltipElement=document.createElement('div');
        tooltipElement.className='card'
        tooltipElement.textContent='Dummy!'
        tooltipElement.addEventListener('click',this.closeTooltip.bind(this))
        this.element=tooltipElement;
    }
}

class DOMHelper{
    static clearEventListeners(element){
        const clonedElement=element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement
    }
    static moveElement(ElementId,newDestinationSelector){
        const element=document.getElementById(ElementId);
        const destinationElement=document.querySelector(newDestinationSelector)

        destinationElement.append(element)
    }
}
class ProjectList {
  //manages a box ,Multiple instances of List || The ul
  projects=[];
  constructor(type) { //type==Active or Finished Project
    this.type=type;

    const prjItems=document.querySelectorAll(`#${type}-projects li`)
    console.log(prjItems)
    for (const prjItem of prjItems){
        this.projects.push(new ProjectItem(prjItem.id,this.switchProject.bind(this),this.type))
    }
    console.log(this.projects)
  }

  setSwitchHandlerFunction(switchHandlerFunction){
    this.switchHandler=switchHandlerFunction;
  }

  addProject(project){
    this.projects.push(project)
    console.log(this)
    DOMHelper.moveElement(project.id,`#${this.type}-projects ul`)
    project.update(this.switchProject.bind(this),this.type);
  }

  switchProject(projectId){//switch to another project
    // const projectIndex=this.projects.findIndex(p=>p.id===projectId)
    // this.projects.splice(projectIndex,1)
    this.switchHandler(this.projects.find(p=>p.id===projectId))
     this.projects=this.projects.filter(p=>p.id !==projectId)
  }
}

class ProjectItem {
    hasActiveTooltip=false;
    constructor(id,updateProjectListFunction,type){
        this.id=id
        this.updateProjectListsHandler=updateProjectListFunction;
        this.connectSwitchButton(type)
        this.connectMoreInfoButton()
    }
  //renderd item{Single Item} The li
  showMoreInfoHandler(){
    if(this.hasActiveTooltip){
        return
    }
    const tooltip=new Tooltip(()=>{
        this.hasActiveTooltip=false;
    });
    tooltip.attach();
    this.hasActiveTooltip=true;
  }
connectMoreInfoButton(){
    const projectItemElement=document.getElementById(this.id);
    const moreInfoBtn=projectItemElement.querySelector('button:first-of-type')
    moreInfoBtn.addEventListener('click',this.showMoreInfoHandler)
}
  connectSwitchButton(type){
    const projectItemElement=document.getElementById(this.id)
    let switchBtn=projectItemElement.querySelector('button:last-of-type')
    switchBtn=DOMHelper.clearEventListeners(switchBtn)
    switchBtn.textContent=type==='active'?'Finish':'Activate'
    switchBtn.addEventListener('click',this.updateProjectListsHandler.bind(null,this.id))
  }
  update(updateProjectListFn,type){
    this.updateProjectListsHandler=updateProjectListFn;
    this.connectSwitchButton(type);
  }
}

class App {
  static init() {
    const activeProjectsList=new ProjectList('active'); //found in section
    const finishedProjectsList=new ProjectList('finished');
    activeProjectsList.setSwitchHandlerFunction(finishedProjectsList.addProject.bind(finishedProjectsList))
    finishedProjectsList.setSwitchHandlerFunction(activeProjectsList.addProject.bind(activeProjectsList))
  }
}

App.init();
