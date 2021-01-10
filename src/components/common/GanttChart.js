import Gantt from "frappe-gantt";
import moment from "moment";
import React from "react";
import ReactDOMServer from "react-dom/server";

class GanttChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gantt: null,
      tasks: this.props.tasks
        ? this.props.tasks
        : [
            {
              id: "11111111111",
              name: "Örnek Görev",
              start: moment().format("YYYY-MM-DD"),
              end: moment().add(1, "d").format("YYYY-MM-DD"),
              progress: 100,
            },
          ],
    };
    this.removeTask = this.removeTask.bind(this);
  }

  getTasks = () => {
    return this.state.tasks;
  };

  addTask = (task) => {
    let _tasks = this.state.tasks;
    _tasks.push(task);
    this.setState({ tasks: _tasks });
    this.initializeGantt();
  };

  removeTask = (id) => {
    let _tasks = this.state.tasks;
    let taskIndex = _tasks.findIndex((x) => x.id === id);
    _tasks.splice(taskIndex, 1);
    this.setState({ tasks: _tasks });
    this.initializeGantt();
  };

  setGanttChartViewMode = (mode) => {
    this.state.gantt?.change_view_mode(mode);
    this.setState({ activeViewMode: mode });
  };

  initializeGantt = () => {
    const gantt = new Gantt("#gantt-target", this.state.tasks, {
      view_modes: ["Day", "Week", "Month"],
      view_mode: "Week",
      date_format: "DD.MM.YYYY",
      language: "tr",
      custom_popup_html: (task) => {
        return this.renderPopupContent(task);
      },
    });
    this.setState({ gantt: gantt });
  };

  componentDidMount() {
    this.initializeGantt();
  }

  renderPopupContent = (task) => {
    const start_date = moment(task._start).format("DD MMMM");
    const end_date = moment(task._end).format("DD MMMM");
    const html = (
      <div className="task-details-container">
        <h5>{task.name}</h5>
        <p>Başlangıç: {start_date}</p>
        <p>Bitiş: {end_date}</p>
      </div>
    );
    return ReactDOMServer.renderToStaticMarkup(html);
  };

  render() {
    return (
      <div
        id="gantt-target"
        style={{ width: "100%", minHeight: "500px" }}
      ></div>
    );
  }
}

export default GanttChart;
