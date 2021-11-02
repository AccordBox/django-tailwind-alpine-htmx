// This is the scss entry file
import "../styles/index.scss";

import htmx from "htmx.org/dist/htmx";
window.htmx = htmx;

import Alpine from 'alpinejs';
import Counter from "../components/Counter";
import DatePicker from "../components/DatePicker";
import Task from "../components/Task";
import ModalForm from "../components/ModalForm";
import ModalFormHTMX from "../components/ModalFormHTMX";

Alpine.data('Counter', Counter);
Alpine.data('DatePicker', DatePicker);
Alpine.data('Task', Task);
Alpine.data('ModalForm', ModalForm);
Alpine.data('ModalFormHTMX', ModalFormHTMX);
Alpine.start();

if (process.env.NODE_ENV === "development") {
    // enable logging
    window.htmx.logAll();
}
