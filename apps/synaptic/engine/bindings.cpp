#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "distiller.h"

namespace py = pybind11;

PYBIND11_MODULE(synaptic_engine, m) {
    m.doc() = "Synaptic Compression Logic Engine using C++ CDCL."; // optional module docstring

    py::class_<synaptic::SatisfiabilityDistiller>(m, "SatisfiabilityDistiller")
        .def(py::init<>())
        .def("add_proposition", &synaptic::SatisfiabilityDistiller::add_proposition, "Add a logic proposition string.")
        .def("distill", &synaptic::SatisfiabilityDistiller::distill, "Process propositions using CDCL to remove redundancies and return the minimized list.");
}
