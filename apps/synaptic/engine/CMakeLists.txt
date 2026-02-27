cmake_minimum_required(VERSION 3.15)
project(SynapticEngine VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Python and Pybind11 directories explicitly
execute_process(COMMAND python3 -c "import sysconfig; print(sysconfig.get_path('include'))" OUTPUT_VARIABLE PYTHON_INCLUDE_DIR OUTPUT_STRIP_TRAILING_WHITESPACE)
execute_process(COMMAND python3 -m pybind11 --includes OUTPUT_VARIABLE PYBIND11_INCLUDES OUTPUT_STRIP_TRAILING_WHITESPACE)

# Convert the "-I/path/to/pybind11 -I/path/to/python" string into a list of paths
string(REPLACE "-I" "" PYBIND11_INCLUDES "${PYBIND11_INCLUDES}")
separate_arguments(PYBIND11_INCLUDES_LIST UNIX_COMMAND "${PYBIND11_INCLUDES}")

add_library(synaptic_engine MODULE distiller.cpp bindings.cpp)

# Include Python and Pybind11 headers
target_include_directories(synaptic_engine PRIVATE ${PYTHON_INCLUDE_DIR} ${PYBIND11_INCLUDES_LIST})

set_target_properties(synaptic_engine PROPERTIES PREFIX "" SUFFIX ".so")
