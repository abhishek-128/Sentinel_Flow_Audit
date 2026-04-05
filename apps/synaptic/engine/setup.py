from pybind11.setup_helpers import Pybind11Extension, build_ext
from setuptools import setup

ext_modules = [
    Pybind11Extension(
        "synaptic_engine",
        ["bindings.cpp", "distiller.cpp"],
        cxx_std=20,
    ),
]

setup(
    name="synaptic_engine",
    ext_modules=ext_modules,
    cmdclass={"build_ext": build_ext},
)
